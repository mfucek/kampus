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
	})
});
