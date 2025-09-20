import { publicProcedure } from '@/deps/trpc/trpc';

export const generalTopicsListAllProcedure = publicProcedure.query(
	async ({ ctx }) => {
		const { db } = ctx;

		const generalTopicsRaw = await db.generalTopic.findMany({
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

		const generalTopics = generalTopicsRaw.map((generalTopicRaw) => ({
			...generalTopicRaw.Topic,
			link: `/${generalTopicRaw.Topic.slug}`,
			postsCount: generalTopicRaw.Topic._count.Posts
		}));

		return { generalTopics };
	}
);

export type GeneralTopicsListItem = Awaited<
	ReturnType<typeof generalTopicsListAllProcedure>
>['generalTopics'][number];
