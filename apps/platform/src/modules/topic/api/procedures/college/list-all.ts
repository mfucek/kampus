import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { publicProcedure } from '@/deps/trpc/trpc';
import { type CollegeGetItem } from './get-by-id';

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
						},
						Image: {
							include: {
								File: true
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

		const colleges = await Promise.all(
			collegesRaw.map(async (college) => ({
				topic: {
					name: college.Topic.name,
					id: college.Topic.id,
					type: college.Topic.type,
					slug: college.Topic.slug,
					shortName: college.Topic.shortName,
					imageUrl: college.Topic.Image?.File.key
						? await getFileDownloadUrl(college.Topic.Image.File.key)
						: null
				} satisfies CollegeGetItem['topic'],
				college: {
					externalLinks: college.externalLinks
				} satisfies CollegeGetItem['college'],
				link: `/${college.Topic.slug}`,
				postsCount: college.Topic._count.Posts
			}))
		);

		return { colleges };
	}
);

export type CollegesListItem = Awaited<
	ReturnType<typeof collegesListAllProcedure>
>['colleges'][number];
