import { protectedProcedure } from '@/lib/trpc/trpc';

export const getUserProcedure = protectedProcedure.query(async ({ ctx }) => {
	const { user } = ctx;
	return user;
});
