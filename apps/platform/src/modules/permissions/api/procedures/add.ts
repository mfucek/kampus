import { z } from 'zod';

import { protectedProcedure } from '@/deps/trpc/trpc';
import { RuleType, ScopeType } from '@prisma/client';

export const addProcedure = protectedProcedure
	.input(
		z.object({
			accountId: z.string(),
			rule: z.nativeEnum(RuleType),
			scopeType: z.nativeEnum(ScopeType),
			scopeId: z.string().nullable(),
			value: z.boolean()
		})
	)
	.mutation(async ({ ctx, input }) => {
		const permissionRaw = await ctx.db.permission.create({
			data: {
				rule: input.rule,
				accountId: input.accountId,
				scopeType: input.scopeType,
				scopeId: input.scopeId,
				value: input.value
			}
		});

		return permissionRaw;
	});
