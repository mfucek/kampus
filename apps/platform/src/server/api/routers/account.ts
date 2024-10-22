import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const accountRouter = createTRPCRouter({
	getAccount: protectedProcedure.query(async ({ ctx }) => {
		const { db, auth } = ctx;

		const account = await db.account.findFirst({
			where: {
				clerkUserId: auth.userId!
			}
		});

		return account;
	}),

	getUser: protectedProcedure.query(async ({ ctx }) => {
		const { user } = ctx;

		return user;
	}),

	updateDisplayName: protectedProcedure
		.input(
			z.object({
				displayName: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { db, user } = ctx;

			await db.user.update({
				where: {
					id: user.id!
				},
				data: {
					displayName: input.displayName
				}
			});

			return;
		}),

	updateBadge: protectedProcedure
		.input(z.object({ badge: z.string().nullable() }))
		.mutation(async ({ ctx, input }) => {
			const { db, user } = ctx;

			await db.user.updateMany({
				where: {
					id: user.id!
				},
				data: {
					badge: input.badge || null
				}
			});

			return { success: true };
		})
});
