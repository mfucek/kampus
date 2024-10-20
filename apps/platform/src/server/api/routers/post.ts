import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { VoteType } from '@prisma/client';
import { z } from 'zod';

export const postRouter = createTRPCRouter({
	getCollegePostsByCollegeSlug: publicProcedure
		.input(z.object({ collegeSlug: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;

			const posts = await db.post.findMany({
				where: {
					college: {
						slug: input.collegeSlug
					},
					topicId: null,
					replyToId: null
				},
				include: {
					_count: {
						select: {
							replies: true
						}
					},
					author: true
				},
				orderBy: {
					createdAt: 'desc'
				}
			});

			const postsWithVotes = await Promise.all(
				posts.map(async (post) => {
					const votes = await db.vote.findMany({
						where: {
							postId: post.id
						}
					});

					const likes = votes.filter(
						(vote) => vote.type === VoteType.UP
					).length;
					const dislikes = votes.filter(
						(vote) => vote.type === VoteType.DOWN
					).length;

					return {
						...post,
						votes: {
							likes,
							dislikes
						}
					};
				})
			);

			return postsWithVotes;
		}),

	getTopicPostsById: publicProcedure
		.input(z.object({ topicId: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;

			const posts = await db.post.findMany({
				where: {
					topicId: input.topicId,
					replyToId: null
				},
				include: {
					_count: {
						select: {
							replies: true
						}
					},
					author: true
				},
				orderBy: {
					createdAt: 'desc' // Optional: Order posts by creation date, newest first
				}
			});

			return posts;
		})
});
