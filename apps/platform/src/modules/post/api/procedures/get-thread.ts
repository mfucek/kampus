import { VoteType } from '@prisma/client';
import { type JSONContent } from '@tiptap/react';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { getFileUrl } from '@/lib/s3';
import { optionalAuthMiddleware, publicProcedure } from '@/server/api/trpc';
import { type RecursivePost } from '../../types/recursive-post';

const MAX_DEPTH = 5;

export const getThreadProcedure = publicProcedure
	.use(optionalAuthMiddleware)
	.input(z.object({ postId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		let userId = null;
		if (ctx.user) {
			userId = ctx.user.id;
		}

		const fetchReplies = async (
			postId: string,
			depth = 0
		): Promise<RecursivePost | null> => {
			if (depth > MAX_DEPTH) {
				return null;
			}

			const post = await db.post.findUnique({
				where: { id: postId },
				include: {
					Author: true,
					_count: {
						select: { Replies: true }
					},
					Files: {
						include: {
							DocumentFile: true,
							ImageFile: true
						}
					}
				}
			});

			if (!post) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
			}

			const votes = await db.vote.findMany({
				where: { postId: post.id }
			});

			const likes = votes.filter((vote) => vote.type === VoteType.UP).length;
			const dislikes = votes.filter(
				(vote) => vote.type === VoteType.DOWN
			).length;
			const userVote =
				votes.find((vote) => vote.userId === userId)?.type ?? null;

			const replies = await db.post.findMany({
				where: { replyToId: postId },
				orderBy: { createdAt: 'asc' }
			});

			const recursiveReplies = await Promise.all(
				replies.map((reply) => fetchReplies(reply.id, depth + 1))
			);

			const filesWithUrls = await Promise.all(
				post.Files.map(async (file) => ({
					...file,
					url: await getFileUrl(file.key)
				}))
			);

			const fullPost: RecursivePost = {
				post: {
					...post,
					id: post.id,
					body: post.body as JSONContent,
					createdAt: post.createdAt,
					author: {
						id: post.Author.id,
						createdAt: post.Author.createdAt,
						updatedAt: post.Author.updatedAt,
						displayName: post.Author.displayName,
						imageUrl: post.Author.imageUrl,
						accountId: post.Author.accountId,
						badge: post.Author.badge
					},
					_count: {
						replies: post._count.Replies
					}
				},
				replies: recursiveReplies.filter((reply) => reply !== null),
				votes: {
					likes,
					dislikes,
					userVote
				},
				files: filesWithUrls.map((file) => ({
					...file,
					documentFile: file.DocumentFile
						? {
								academicYear: file.DocumentFile.academicYear ?? undefined,
								types: file.DocumentFile.types,
								title: file.DocumentFile.title ?? undefined
							}
						: null,
					imageFile: file.ImageFile ? file.ImageFile : null
				}))
			};

			return fullPost;
		};

		const thread = await fetchReplies(input.postId);
		return thread;
	});
