import { protectedProcedure } from '@/deps/trpc/trpc';

export const listProcedure = protectedProcedure.query(async ({ ctx }) => {
	const { db } = ctx;

	const accountsRaw = await db.account.findMany({
		where: {
			user: {
				isNot: null
			}
		},
		include: {
			user: true
		}
	});

	const accounts = accountsRaw.map((account) => {
		return {
			...account,
			user: account.user!
		};
	});

	return accounts;
});

export type ListAccountsItem = Awaited<
	ReturnType<typeof listProcedure>
>[number];
