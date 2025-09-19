import { protectedProcedure } from '@/deps/trpc/trpc';

export const listProcedure = protectedProcedure.query(async ({ ctx }) => {
	const { db } = ctx;

	const usersRaw = await db.user.findMany();

	return usersRaw;
});

export type ListUsersItem = Awaited<ReturnType<typeof listProcedure>>[number];
