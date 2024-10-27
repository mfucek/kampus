import { z } from 'zod';

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

		const postWithVotes = {
			post: typesafePost,
			votes: await getPostVotes(post.id, null, db)
		};

		postWithVotes.post.author.imageUrl;
		return postWithVotes;
	});
