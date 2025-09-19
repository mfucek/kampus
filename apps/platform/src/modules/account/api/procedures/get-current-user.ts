import { protectedProcedure } from '@/deps/trpc/trpc';

export const getCurrentUserProcedure = protectedProcedure.query(
	async ({ ctx }) => {
		const { user } = ctx;

		return user;
	}
);
