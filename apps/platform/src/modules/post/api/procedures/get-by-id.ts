import { type JSONContent } from '@tiptap/react';
import { z } from 'zod';

import { getFileUrl } from '@/lib/s3';
import { publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { getPostVotes } from '../helpers/get-post-votes';

export const getPostByIdProcedure = publicProcedure
	.input(z.object({ postId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const post = await db.post.findUnique({
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

		if (!post) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
		}

		const typesafePost = {
			...post,
			body: post.body as JSONContent
		};

		const filesWithUrls = await Promise.all(
			post.Files.map(async (file) => ({
				...file,
				url: await getFileUrl(file.key)
			}))
		);

		const postWithVotes = {
			post: typesafePost,
			votes: await getPostVotes(post.id, null, db),
			files: filesWithUrls.map((file) => ({
				...file,
				documentFile: file.DocumentFile
					? {
							academicYear: file.DocumentFile.academicYear ?? undefined,
							types: file.DocumentFile.types,
							title: file.DocumentFile.title ?? undefined
						}
					: null
			}))
		};

		return postWithVotes;
	});
