import { protectedProcedure } from '@/deps/trpc/trpc';

export const getUserProcedure = protectedProcedure.query(async ({ ctx }) => {
	const { user } = ctx;
	return user;
});
