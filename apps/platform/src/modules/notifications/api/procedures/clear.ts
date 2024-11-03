import { z } from 'zod';

import { protectedProcedure } from '@/server/api/trpc';

/**
 * Clear a notification by notification id or clear multiple notifications by post id
 */
export const clearProcedure = protectedProcedure
	.input(
		z.object({
			notificationId: z.string().nullish(),
			postId: z.string().nullish()
		})
	)
	.mutation(async ({ input, ctx }) => {
		const { db } = ctx;
		return;
	});
