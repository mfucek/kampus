import { protectedProcedure } from '@/lib/trpc/trpc';

export const getCurrentUserIdProcedure = protectedProcedure.query(
	async ({ ctx }) => {
		const { user } = ctx;

		return user.id;
	}
);
