import { protectedProcedure } from '@/deps/trpc/trpc';

export const clearAllProcedure = protectedProcedure.mutation(async ({}) => {
	return;
});
