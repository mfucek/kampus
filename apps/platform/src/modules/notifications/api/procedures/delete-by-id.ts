import { protectedProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const deleteByIdProcedure = protectedProcedure
	.input(z.object({ notificationId: z.string() }))
	.mutation(async ({ input, ctx }) => {
		const { db, user } = ctx;

		const notification = await db.notification.findUnique({
			where: {
				id: input.notificationId
			}
		});

		if (!notification) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Notification not found'
			});
		}

		if (user.id !== notification.recepientId) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'You are not allowed to delete this notification'
			});
		}

		await db.notification.delete({
			where: {
				id: input.notificationId
			}
		});

		return { success: true };
	});
