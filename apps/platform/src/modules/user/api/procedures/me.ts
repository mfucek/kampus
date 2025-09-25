import { publicProcedure } from '@/deps/trpc/trpc';

export const meProcedure = publicProcedure.query(async ({ ctx }) => {
	const { user } = ctx;

	if (!user) return null;

	const userRaw = await ctx.db.user.findUnique({
		where: {
			id: user.id
		}
	});

	return userRaw;
});
