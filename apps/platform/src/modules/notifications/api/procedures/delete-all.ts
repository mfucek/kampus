import { protectedProcedure } from '@/deps/trpc/trpc';

export const deleteAllProcedure = protectedProcedure.mutation(
	async ({ ctx }) => {
		const { db, user } = ctx;

		await db.notification.deleteMany({
			where: {
				recepientId: user.id
			}
		});

		return { success: true };
	}
);
