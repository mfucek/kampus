import { type JSONContent } from '@tiptap/react';
import { z } from 'zod';

import { getFileUrl } from '@/lib/s3';
import { publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type FullPost } from '../../types/full-post';
import { getPostVotes } from '../helpers/get-post-votes';

export const getPostByIdProcedure = publicProcedure
	.input(z.object({ postId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

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
				Files: {
					include: {
						DocumentFile: true,
						ImageFile: true
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
				displayName: postRaw.Author.displayName,
				imageUrl: postRaw.Author.imageUrl,
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

		const files = await Promise.all(
			postRaw.Files.map(async (file) => ({
				id: file.id,
				key: file.key,
				imageFile: file.ImageFile,
				url: await getFileUrl(file.key),
				documentFile: file.DocumentFile
					? {
							academicYear: file.DocumentFile.academicYear ?? undefined,
							types: file.DocumentFile.types,
							title: file.DocumentFile.title ?? undefined
						}
					: null
			}))
		);

		const votes = await getPostVotes(postRaw.id, null, db);

		const output = {
			post: post,
			votes: votes,
			files: files
		} satisfies FullPost;

		return output;
	});
