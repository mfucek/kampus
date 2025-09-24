import { z } from 'zod';

import { protectedProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';

export const createFollowProcedure = protectedProcedure
	.input(
		z.object({
			topicId: z.string()
		})
	)
	.mutation(async ({ input, ctx }) => {
		const { db, user } = ctx;

		// Check if follow already exists
		const existingFollow = await db.topicFollow.findUnique({
			where: {
				userId_topicId: {
					userId: user.id,
					topicId: input.topicId
				}
			}
		});

		console.log(existingFollow);

		// If follow does not exist, create it
		if (!existingFollow) {
			await db.topicFollow.create({
				data: {
					userId: user.id,
					topicId: input.topicId,
					active: true
				}
			});
			return { success: true };
		}

		// If follow exists but is inactive, reactivate it
		if (existingFollow && !existingFollow.active) {
			await db.topicFollow.update({
				where: {
					userId_topicId: {
						userId: user.id,
						topicId: input.topicId
					}
				},
				data: {
					active: true
				}
			});
			return { success: true };
		}

		// If follow exists and is active
		if (existingFollow && existingFollow.active) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'User is already following this topic'
			});
		}
	});
