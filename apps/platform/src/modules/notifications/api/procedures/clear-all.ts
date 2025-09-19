import { protectedProcedure } from '@/lib/trpc/trpc';

export const clearAllProcedure = protectedProcedure.mutation(async ({}) => {
	return;
});
