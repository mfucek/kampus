import { z } from 'zod';

import { hasUserPermission } from '@/modules/permissions/helpers/has-user-permission';
import { optionalAuthMiddleware, publicProcedure } from '@/server/api/trpc';
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
