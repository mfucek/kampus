import { type JSONContent } from '@tiptap/react';
import { z } from 'zod';

import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { optionalAuthMiddleware, publicProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { type FullPost } from '../../types/full-post';
import { getPostVotes } from '../helpers/get-post-votes';

export const getPostByIdProcedure = publicProcedure
	.use(optionalAuthMiddleware)
	.input(z.object({ postId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { user, db } = ctx;

		const postRaw = await db.post.findUnique({
			where: {
				id: input.postId
			},
			include: {
				_count: {
					select: {
						Replies: true
					}
				},
				Author: true,
				DocumentFiles: {
					include: {
						File: true
					}
				}
			}
		});

		if (!postRaw) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
		}

		const post = {
			author: {
				id: postRaw.Author.id,
				name: postRaw.Author.name,
				imageUrl: postRaw.Author.image,
				badge: postRaw.Author.badge
			},
			authorId: postRaw.authorId,
			id: postRaw.id,
			body: postRaw.body as JSONContent,
			createdAt: postRaw.createdAt,
			updatedAt: postRaw.updatedAt,
			collegeId: postRaw.collegeId,
			topicId: postRaw.topicId,
			replyToId: postRaw.replyToId,
			_count: {
				replies: postRaw._count.Replies
			}
		} satisfies FullPost['post'];

		const documentFiles = await Promise.all(
			postRaw.DocumentFiles.map(async (documentFile) => ({
				fileId: documentFile.File.id,
				contentType: documentFile.File.contentType,
				size: documentFile.File.size,
				key: documentFile.File.key,
				academicYear: documentFile.academicYear,
				types: documentFile.types,
				title: documentFile.title,
				url: await getFileDownloadUrl(documentFile.File.key)
			}))
		);

		const votes = await getPostVotes(postRaw.id, user?.id, db);

		const output = {
			post: post,
			votes: votes,
			documentFiles: documentFiles
		} satisfies FullPost;

		return output;
	});
