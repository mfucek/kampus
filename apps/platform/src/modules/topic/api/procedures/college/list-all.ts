import { publicProcedure } from '@/deps/trpc/trpc';
import { CollegeGetItem } from './get-by-id';

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

		// DTOs

		const colleges = collegesRaw.map((college) => ({
			topic: {
				name: college.Topic.name,
				id: college.Topic.id,
				type: college.Topic.type,
				slug: college.Topic.slug,
				shortName: college.Topic.shortName
			} satisfies CollegeGetItem['topic'],
			college: {
				externalLinks: college.externalLinks
			} satisfies CollegeGetItem['college'],
			link: `/${college.Topic.slug}`,
			postsCount: college.Topic._count.Posts
		}));

		return { colleges };
	}
);

export type CollegesListItem = Awaited<
	ReturnType<typeof collegesListAllProcedure>
>['colleges'][number];
