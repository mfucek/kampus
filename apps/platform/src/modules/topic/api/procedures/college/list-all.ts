import { publicProcedure } from '@/deps/trpc/trpc';

export const collegesListAllProcedure = publicProcedure.query(
	async ({ ctx }) => {
		const { db } = ctx;

		const collegesRaw = await db.college.findMany({
			include: {
				Topic: {
					include: {
						_count: {
							select: {
								Posts: true
							}
						}
					}
				}
			},
			orderBy: {
				Topic: {
					Posts: {
						_count: 'desc'
					}
				}
			}
		});

		const colleges = collegesRaw.map((college) => ({
			...college,
			link: `/${college.Topic.slug}`,
			postsCount: college.Topic._count.Posts
		}));

		return { colleges };
	}
);

export type CollegesListItem = Awaited<
	ReturnType<typeof collegesListAllProcedure>
>['colleges'][number];
