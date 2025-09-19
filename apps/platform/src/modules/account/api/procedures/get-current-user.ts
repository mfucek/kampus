import { protectedProcedure } from '@/lib/trpc/trpc';

export const getCurrentUserProcedure = protectedProcedure.query(
	async ({ ctx }) => {
		const { user } = ctx;

		return user;
	}
);
