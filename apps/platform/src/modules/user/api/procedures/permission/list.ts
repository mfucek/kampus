import { z } from 'zod';

import { protectedProcedure } from '@/deps/trpc/trpc';

export const listProcedure = protectedProcedure
	.input(z.object({ userId: z.string() }))
	.query(async ({ ctx, input }) => {
		const permissionsRaw = await ctx.db.permission.findMany({
			where: {
				userId: input.userId
			}
		});

		const permissions = permissionsRaw.map((permission) => {
			return {
				...permission
			};
		});

		return permissions;
	});

export type ListPermissionsItem = Awaited<
	ReturnType<typeof listProcedure>
>[number];
