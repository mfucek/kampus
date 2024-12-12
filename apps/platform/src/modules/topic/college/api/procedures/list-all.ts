import { publicProcedure } from '@/server/api/trpc';

export const listAllProcedure = publicProcedure.query(async ({ ctx }) => {
	const { db } = ctx;

	const colleges = await db.college.findMany({
		orderBy: {
			Posts: {
				_count: 'desc'
			}
		}
	});
	return colleges;
});
