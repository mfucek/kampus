import { protectedProcedure } from '@/server/api/trpc';

export const getAccoutProcedure = protectedProcedure.query(async ({ ctx }) => {
	const { db, auth } = ctx;

	const account = await db.account.findFirst({
		where: {
			clerkUserId: auth.userId
		}
	});

	return account;
});
