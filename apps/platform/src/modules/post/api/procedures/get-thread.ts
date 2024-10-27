import { getFileUrl } from '@/lib/s3';
import { publicProcedure } from '@/server/api/trpc';
import { VoteType } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { RecursivePost } from '../../types/recursive-post';

export const getThreadProcedure = publicProcedure
	.input(z.object({ postId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		let userId = null;
		if (ctx.clerkUserId) {
			const account = await db.account.findUnique({
				where: {
					clerkUserId: ctx.clerkUserId
				},
				include: {
					user: true
				}
			});

			userId = account?.user?.id;
		}

		const fetchReplies = async (postId: string): Promise<RecursivePost> => {
			const post = await db.post.findUnique({
				where: { id: postId },
				include: {
					author: true,
					_count: {
						select: { replies: true }
					},
					files: {
						include: {
							documentFile: true,
							imageFile: true
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
				replies.map((reply) => fetchReplies(reply.id))
			);

			const filesWithUrls = await Promise.all(
				post.files.map(async (file) => ({
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
						id: post.author.id,
						createdAt: post.author.createdAt,
						updatedAt: post.author.updatedAt,
						displayName: post.author.displayName,
						imageUrl: post.author.imageUrl,
						accountId: post.author.accountId,
						badge: post.author.badge
					},
					_count: {
						replies: post._count.replies
					}
				},
				replies: recursiveReplies,
				votes: {
					likes,
					dislikes,
					userVote
				},
				files: filesWithUrls.map((file) => ({
					...file,
					documentFile: file.documentFile
						? {
								academicYear: file.documentFile.academicYear ?? undefined,
								types: file.documentFile.types,
								title: file.documentFile.title ?? undefined
							}
						: null
				}))
			};

			return fullPost;
		};

		const thread = await fetchReplies(input.postId);
		return thread;
	});
