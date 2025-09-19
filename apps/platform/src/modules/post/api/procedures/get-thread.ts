import { type JSONContent } from '@tiptap/react';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { optionalAuthMiddleware, publicProcedure } from '@/deps/trpc/trpc';
import { type RecursivePost } from '../../types/recursive-post';
import { sortPostVotes } from '../helpers/get-post-votes';

const MAX_DEPTH = 5;

export const getThreadProcedure = publicProcedure
	.use(optionalAuthMiddleware)
	.input(z.object({ postId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { user, db } = ctx;

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
					DocumentFiles: {
						include: {
							File: true
						}
					},
					Votes: true
				}
			});

			if (!post) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
			}

			const votes = sortPostVotes(post.Votes, user?.id);

			const replies = await db.post.findMany({
				where: { replyToId: postId },
				orderBy: { createdAt: 'asc' }
			});

			const recursiveReplies = await Promise.all(
				replies.map((reply) => fetchReplies(reply.id, depth + 1))
			);

			const documentFilesWithUrls = await Promise.all(
				post.DocumentFiles.map(async (documentFile) => ({
					...documentFile,
					url: await getFileDownloadUrl(documentFile.File.key)
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
						name: post.Author.name,
						imageUrl: post.Author.image,
						badge: post.Author.badge
					},
					_count: {
						replies: post._count.Replies
					}
				},
				replies: recursiveReplies.filter((reply) => reply !== null),
				votes: votes,
				documentFiles: documentFilesWithUrls.map((file) => ({
					fileId: file.File.id,
					contentType: file.File.contentType,
					size: file.File.size,
					key: file.File.key,
					academicYear: file.academicYear,
					title: file.title,
					types: file.types,
					url: file.url
				}))
			};

			return fullPost;
		};

		const thread = await fetchReplies(input.postId);
		return thread;
	});
