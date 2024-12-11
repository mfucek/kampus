import { z } from 'zod';

import { protectedProcedure } from '@/server/api/trpc';

export const updateBadgeProcedure = protectedProcedure
	.input(z.object({ badge: z.string().nullable() }))
	.mutation(async ({ ctx, input }) => {
		const { db, user } = ctx;

		await db.user.updateMany({
			where: {
				id: user.id
			},
			data: {
				badge: input.badge ?? null
			}
		});

		return { success: true };
	});
