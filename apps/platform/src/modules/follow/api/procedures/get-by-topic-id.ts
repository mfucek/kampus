import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';

export const getByTopicIdProcedure = publicProcedure
	.input(
		z.object({
			topicId: z.string()
		})
	)
	.query(async ({ input, ctx }) => {
		const { db, user } = ctx;

		// Get follow counts
		const [activeFollows, totalFollows] = await Promise.all([
			db.topicFollow.count({
				where: {
					topicId: input.topicId,
					active: true
				}
			}),
			db.topicFollow.count({
				where: {
					topicId: input.topicId
				}
			})
		]);

		// Check if current user is following (if logged in)
		let isFollowing = false;
		if (user) {
			const userFollow = await db.topicFollow.findUnique({
				where: {
					userId_topicId: {
						userId: user.id,
						topicId: input.topicId
					}
				}
			});
			isFollowing = userFollow?.active ?? false;
		}

		return {
			activeFollows,
			totalFollows,
			isFollowing
		};
	});
