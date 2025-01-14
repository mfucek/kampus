import { protectedProcedure } from '@/server/api/trpc';

export const getCurrentUserProcedure = protectedProcedure.query(
	async ({ ctx }) => {
		const { user } = ctx;

		return user;
	}
);
