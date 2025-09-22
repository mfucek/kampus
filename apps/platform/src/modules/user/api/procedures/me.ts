import { publicProcedure } from '@/deps/trpc/trpc';

export const meProcedure = publicProcedure.query(async ({ ctx }) => {
	const { user } = ctx;
	return user;
});
