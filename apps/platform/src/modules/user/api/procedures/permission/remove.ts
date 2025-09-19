import { z } from 'zod';

import { protectedProcedure } from '@/deps/trpc/trpc';
import { RuleType, ScopeType } from '@prisma/client';

export const removeProcedure = protectedProcedure
	.input(
		z.object({
			userId: z.string(),
			rule: z.nativeEnum(RuleType),
			scopeType: z.nativeEnum(ScopeType),
			scopeId: z.string().nullable()
		})
	)
	.mutation(async ({ ctx, input }) => {
		const permissionRaw = await ctx.db.permission.delete({
			where: {
				userId: input.userId,
				rule: input.rule,
				scopeType: input.scopeType,
				scopeId: input.scopeId
			}
		});

		return permissionRaw;
	});
