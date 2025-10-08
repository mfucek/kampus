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

		const generalTopics = generalTopicsRaw.map((generalTopicRaw) => {
			const topic = {
				name: generalTopicRaw.Topic.name,
				id: generalTopicRaw.Topic.id,
				type: generalTopicRaw.Topic.type,
				slug: generalTopicRaw.Topic.slug,
				shortName: generalTopicRaw.Topic.shortName
			};

			const generalTopic = {
				icon: generalTopicRaw.icon
			};

			return {
				topic,
				generalTopic,
				link: `/general/${generalTopicRaw.Topic.slug}`,
				postsCount: generalTopicRaw.Topic._count.Posts
			};
		});

		return { generalTopics };
	}
);

export type GeneralTopicsListItem = Awaited<
	ReturnType<typeof generalTopicsListAllProcedure>
>['generalTopics'][number];
