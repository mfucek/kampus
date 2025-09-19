import { publicProcedure } from '@/deps/trpc/trpc';

export const listTopCollegesProcedure = publicProcedure.query(
	async ({ ctx }) => {
		const { db } = ctx;

		const collegesRaw = await db.college.findMany({
			take: 3,
			orderBy: {
				Posts: {
					_count: 'desc'
				}
			}
		});

		const colleges = collegesRaw.map((college) => ({
			id: college.id,
			name: college.name,
			slug: college.slug,
			iconSrc: college.iconSrc,
			link: `/${college.slug}`
		}));

		return colleges;
	}
);

export type ListTopCollegesItem = Awaited<
	ReturnType<typeof listTopCollegesProcedure>
>[number];
