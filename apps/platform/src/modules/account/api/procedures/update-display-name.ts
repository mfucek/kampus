import { protectedProcedure } from '@/lib/trpc/trpc';
import { z } from 'zod';

export const updateDisplayNameProcedure = protectedProcedure
	.input(
		z.object({
			displayName: z.string()
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { db, user } = ctx;

		await db.user.update({
			where: {
				id: user.id
			},
			data: {
				displayName: input.displayName
			}
		});

		return;
	});
