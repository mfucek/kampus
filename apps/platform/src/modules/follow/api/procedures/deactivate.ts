import { z } from 'zod';

import { protectedProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';

export const deactivateFollowProcedure = protectedProcedure
	.input(
		z.object({
			topicId: z.string()
		})
	)
	.mutation(async ({ input, ctx }) => {
		const { db, user } = ctx;

		// Find the follow record
		const existingFollow = await db.topicFollow.findUnique({
			where: {
				userId_topicId: {
					userId: user.id,
					topicId: input.topicId
				}
			}
		});

		if (!existingFollow) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User is not following this topic'
			});
		}

		if (existingFollow && !existingFollow.active) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User is already not following this topic'
			});
		}

		// Update the follow to be inactive
		await db.topicFollow.update({
			where: {
				userId_topicId: {
					userId: user.id,
					topicId: input.topicId
				}
			},
			data: {
				active: false
			}
		});

		return { success: true };
	});
