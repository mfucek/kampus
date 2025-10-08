import { z } from 'zod';

import { validateJSONContent } from '@/deps/tiptap/validate-json-content';
import { protectedProcedure } from '@/deps/trpc/trpc';
import { type JSONContent } from '@tiptap/react';

export const createPostProcedure = protectedProcedure
	.input(
		z.object({
			body: z.any(),
			topicId: z.string(),
			replyToId: z.string().optional()
		})
	)
	.mutation(async ({ input, ctx }) => {
		const { db, user } = ctx;

		try {
			validateJSONContent(input.body);
		} catch (error) {
			console.error(error);
		}

		const post = await db.post.create({
			data: {
				body: input.body as JSONContent | null,
				topicId: input.topicId,
				replyToId: input.replyToId,
				authorId: user.id
			},
			include: {
				replyTo: true
			}
		});

		// if post is a reply, notify the author
		if (input.replyToId && post.replyTo) {
			const isSameUser = post.replyTo.authorId === user.id;

			if (!isSameUser) {
				await db.notification.create({
					data: {
						type: 'POST_REPLY',
						postId: post.id,
						recepientId: post.replyTo?.authorId
					}
				});
			}
		}

		return post;
	});
