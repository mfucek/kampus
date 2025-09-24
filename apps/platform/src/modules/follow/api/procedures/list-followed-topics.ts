import { protectedProcedure } from '@/deps/trpc/trpc';

export const listFollowedTopicsProcedure = protectedProcedure.query(
	async ({ ctx }) => {
		const { db, user } = ctx;

		const followedTopics = await db.topicFollow.findMany({
			where: {
				userId: user.id,
				active: true
			}
		});

		const topicIds = followedTopics.map(
			(followedTopic) => followedTopic.topicId
		);

		const topicsRaw = await db.topic.findMany({
			where: {
				id: { in: topicIds }
			},
			include: {
				GeneralTopic: {
					include: {
						Topic: {
							select: {
								slug: true
							}
						}
					}
				},
				College: {
					include: {
						Topic: {
							select: {
								slug: true
							}
						}
					}
				},
				Program: {
					include: {
						Topic: {
							select: {
								slug: true
							}
						},
						College: {
							include: {
								Topic: {
									select: {
										slug: true
									}
								}
							}
						}
					}
				},
				Subject: {
					include: {
						Topic: {
							select: {
								slug: true
							}
						},
						College: {
							include: {
								Topic: {
									select: {
										slug: true
									}
								}
							}
						}
					}
				},
				Staff: {
					include: {
						Topic: {
							select: {
								slug: true
							}
						},
						College: {
							include: {
								Topic: {
									select: {
										slug: true
									}
								}
							}
						}
					}
				}
			}
		});

		const topics = topicsRaw.map((topic) => {
			let link = '';

			if (topic.type === 'GENERAL' && topic.GeneralTopic) {
				link = `/general/${topic.GeneralTopic.Topic.slug}`;
			}

			if (topic.type === 'COLLEGE' && topic.College) {
				link = `/${topic.College.Topic.slug}`;
			}

			if (topic.type === 'PROGRAM' && topic.Program) {
				link = `/${topic.Program.College.Topic.slug}/program/${topic.Program.Topic.slug}`;
			}

			if (topic.type === 'SUBJECT' && topic.Subject) {
				link = `/${topic.Subject.College.Topic.slug}/subject/${topic.Subject.Topic.slug}`;
			}

			if (topic.type === 'STAFF' && topic.Staff) {
				link = `/${topic.Staff.College.Topic.slug}/subject/${topic.Staff.Topic.slug}`;
			}

			return {
				topic: {
					id: topic.id,
					name: topic.name,
					slug: topic.slug,
					type: topic.type
				},
				link
			};
		});

		return { topics };
	}
);

export type ListFollowedTopicsItem = Awaited<
	ReturnType<typeof listFollowedTopicsProcedure>
>['topics'][number];
