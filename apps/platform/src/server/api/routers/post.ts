import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure
} from '@/server/api/trpc';
import { Prisma, VoteType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
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

			let userId = null;
			if (ctx.clerkUserId) {
				const account = await db.account.findUnique({
					where: {
						clerkUserId: ctx.clerkUserId
					},
					include: {
						user: true
					}
				});

				userId = account?.user?.id;
			}

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

					const userVote = votes.find((vote) => vote.userId === userId) ?? null;
					console.log(userVote);

					return {
						...post,
						votes: {
							likes,
							dislikes,
							userVote
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

			let userId = null;
			if (ctx.clerkUserId) {
				const account = await db.account.findUnique({
					where: {
						clerkUserId: ctx.clerkUserId
					},
					include: {
						user: true
					}
				});

				userId = account?.user?.id;
			}

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

					const userVote = votes.find((vote) => vote.userId === userId) ?? null;
					console.log(userVote);

					return {
						...post,
						votes: {
							likes,
							dislikes,
							userVote
						}
					};
				})
			);

			return postsWithVotes;
		}),

	createPost: protectedProcedure
		.input(
			z.object({
				body: z.any(),
				collegeId: z.string(),
				topicId: z.string().optional(),
				replyToId: z.string().optional()
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { db, user } = ctx;

			console.log(input);

			try {
				JSON.parse(input.body);
			} catch (error) {
				console.error(error);
			}

			const post = await db.post.create({
				data: {
					body: input.body,
					collegeId: input.collegeId,
					topicId: input.topicId,
					replyToId: input.replyToId,
					authorId: user.id
				}
			});

			return post;
		}),

	deletePost: protectedProcedure
		.input(z.object({ postId: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { db } = ctx;

			const post = await db.post.findUnique({
				where: {
					id: input.postId
				}
			});

			if (!post) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
			}

			if (post.authorId !== ctx.user.id) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You are not allowed to delete this post'
				});
			}

			const replyCount = await db.post.count({
				where: {
					replyToId: input.postId
				}
			});

			if (replyCount > 0) {
				await db.post.update({
					where: {
						id: input.postId
					},
					data: {
						body: Prisma.DbNull
					}
				});

				return;
			}

			await db.vote.deleteMany({
				where: {
					postId: input.postId
				}
			});

			await db.post.delete({
				where: {
					id: input.postId
				}
			});
		}),

	getPostById: publicProcedure
		.input(z.object({ postId: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;

			const post = await db.post.findUnique({
				where: {
					id: input.postId
				},
				include: {
					_count: {
						select: {
							replies: true
						}
					},
					author: true
				}
			});

			if (!post) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
			}

			let userId = null;
			if (ctx.clerkUserId) {
				const account = await db.account.findUnique({
					where: {
						clerkUserId: ctx.clerkUserId
					},
					include: {
						user: true
					}
				});

				userId = account?.user?.id;
			}

			const votes = await db.vote.findMany({
				where: {
					postId: post.id
				}
			});

			const likes = votes.filter((vote) => vote.type === VoteType.UP).length;
			const dislikes = votes.filter(
				(vote) => vote.type === VoteType.DOWN
			).length;

			const userVote = votes.find((vote) => vote.userId === userId) ?? null;
			console.log(userVote);

			return { ...post, votes: { likes, dislikes, userVote } };
		})
});
