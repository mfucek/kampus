import { publicProcedure } from '@/deps/trpc/trpc';

export const listAllProcedure = publicProcedure.query(async ({ ctx }) => {
	const { db } = ctx;

	const collegesRaw = await db.college.findMany({
		include: {
			_count: {
				select: {
					Posts: true
				}
			}
		},
		orderBy: {
			Posts: {
				_count: 'desc'
			}
		}
	});

	const colleges = collegesRaw.map((college) => ({
		...college,
		link: `/${college.slug}`,
		postCount: college._count.Posts
	}));

	return colleges;
});

export type ListAllCollegesItem = Awaited<
	ReturnType<typeof listAllProcedure>
>[number];
