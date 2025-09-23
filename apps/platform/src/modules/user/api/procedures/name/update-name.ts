import { protectedProcedure } from '@/deps/trpc/trpc';
import { z } from 'zod';

export const updateNameProcedure = protectedProcedure
	.input(
		z.object({
			name: z.string()
		})
	)
	.mutation(async ({ ctx, input }) => {
		const { db, user } = ctx;

		await db.user.update({
			where: {
				id: user.id
			},
			data: {
				name: input.name
			}
		});

		return;
	});
