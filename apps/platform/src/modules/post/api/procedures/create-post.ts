import { protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';

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
			JSON.parse(input.body);
		} catch (error) {
			console.error(error);
		}

		const post = await db.post.create({
			data: {
				body: input.body,
				collegeId: input.collegeId,
				topicId: input.topicId,
				replyToId: input.replyToId,
				authorId: user.id
			}
		});

		return post;
	});
