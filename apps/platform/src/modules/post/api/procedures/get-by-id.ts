import { z } from 'zod';

import { getFileUrl } from '@/lib/s3';
import { publicProcedure } from '@/server/api/trpc';
import { JSONContent } from '@tiptap/react';
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
						replies: true
					}
				},
				author: true,
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

		const typesafePost = {
			...post,
			body: post.body as JSONContent
		};

		const filesWithUrls = await Promise.all(
			post.files.map(async (file) => ({
				...file,
				url: await getFileUrl(file.key)
			}))
		);

		const postWithVotes = {
			post: typesafePost,
			votes: await getPostVotes(post.id, null, db),
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

		postWithVotes.post.author.imageUrl;
		return postWithVotes;
	});
