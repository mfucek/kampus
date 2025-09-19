import { z } from 'zod';

import { optionalAuthMiddleware, publicProcedure } from '@/lib/trpc/trpc';
import { hasUserPermission } from '@/modules/permissions/helpers/has-user-permission';
import { RuleType } from '@prisma/client';

export const hasPermissionProcedure = publicProcedure
	.use(optionalAuthMiddleware)
	.input(
		z.object({ rule: z.nativeEnum(RuleType), scopeId: z.string().optional() })
	)
	.query(async ({ ctx, input }) => {
		const { user } = ctx;

		if (!user) {
			return false;
		}

		const canAccess = await hasUserPermission(
			user.id,
			input.rule,
			input.scopeId
		);

		return canAccess;
	});
