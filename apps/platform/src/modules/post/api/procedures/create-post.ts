import { z } from 'zod';

import { validateJSONContent } from '@/deps/tiptap/validate-json-content';
import { protectedProcedure } from '@/deps/trpc/trpc';
import { type JSONContent } from '@tiptap/react';

export const createPostProcedure = protectedProcedure
	.input(
		z.object({
			body: z.any(),
			collegeId: z.string(),
			topicId: z.string().optional(),
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
				body: input.body as JSONContent,
				collegeId: input.collegeId,
				topicId: input.topicId,
				replyToId: input.replyToId,
				authorId: user.id
			}
		});

		return post;
	});
