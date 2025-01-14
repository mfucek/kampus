import { protectedProcedure } from '@/server/api/trpc';

export const getCurrentUserIdProcedure = protectedProcedure.query(
	async ({ ctx }) => {
		const { user } = ctx;

		return user.id;
	}
);
