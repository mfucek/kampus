import { protectedProcedure } from '@/server/api/trpc';

export const clearAllProcedure = protectedProcedure.mutation(async ({}) => {
	return;
});
