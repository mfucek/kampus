import { publicProcedure } from '@/server/api/trpc';

export const listAllProcedure = publicProcedure.query(async ({ ctx }) => {
	const { db } = ctx;

	const collegesRaw = await db.college.findMany({
		orderBy: {
			Posts: {
				_count: 'desc'
			}
		}
	});

	const colleges = collegesRaw.map((college) => ({
		...college,
		link: `/${college.slug}`
	}));

	return colleges;
});

export type ListAllCollegesItem = Awaited<
	ReturnType<typeof listAllProcedure>
>[number];
