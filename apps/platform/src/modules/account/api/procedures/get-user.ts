import { protectedProcedure } from '@/server/api/trpc';

export const getUserProcedure = protectedProcedure.query(async ({ ctx }) => {
	const { user } = ctx;
	return user;
});
