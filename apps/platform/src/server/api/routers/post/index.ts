import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure
} from '@/server/api/trpc';
import { Prisma, type PrismaClient, VoteType } from '@prisma/client';
import { JSONContent } from '@tiptap/react';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const postRouter = createTRPCRouter({
	listPostsByCollegeSlug: publicProcedure
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
			const typesafePosts = posts.map((post) => ({
				...post,
				body: post.body as JSONContent
			}));

			const userId = await getUserId(ctx.clerkUserId, db);

			const postsWithVotes = await Promise.all(
				typesafePosts.map(async (post) => ({
					post: post,
					votes: await getPostVotes(post.id, userId, db)
				}))
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
					createdAt: 'desc'
				}
			});

			const typesafePosts = posts.map((post) => ({
				...post,
				body: post.body as JSONContent
			}));

			const userId = await getUserId(ctx.clerkUserId, db);

			const postsWithVotes = await Promise.all(
				typesafePosts.map(async (post) => ({
					post: post,
					votes: await getPostVotes(post.id, userId, db)
				}))
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

			const typesafePost = {
				...post,
				body: post.body as JSONContent
			};

			const postWithVotes = {
				post: typesafePost,
				votes: await getPostVotes(post.id, null, db)
			};

			postWithVotes.post.author.imageUrl;
			return postWithVotes;
		}),

	getThread: publicProcedure
		.input(z.object({ postId: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;

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

			const fetchReplies = async (postId: string): Promise<RecursivePost> => {
				const post = await db.post.findUnique({
					where: { id: postId },
					include: {
						author: true,
						_count: {
							select: { replies: true }
						}
					}
				});

				if (!post) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
				}

				const votes = await db.vote.findMany({
					where: { postId: post.id }
				});

				const likes = votes.filter((vote) => vote.type === VoteType.UP).length;
				const dislikes = votes.filter(
					(vote) => vote.type === VoteType.DOWN
				).length;
				const userVote =
					votes.find((vote) => vote.userId === userId)?.type ?? null;

				const replies = await db.post.findMany({
					where: { replyToId: postId },
					orderBy: { createdAt: 'asc' }
				});

				const recursiveReplies = await Promise.all(
					replies.map((reply) => fetchReplies(reply.id))
				);

				return {
					post: {
						...post,
						id: post.id,
						body: post.body as JSONContent,
						createdAt: post.createdAt,
						author: {
							id: post.author.id,
							createdAt: post.author.createdAt,
							updatedAt: post.author.updatedAt,
							displayName: post.author.displayName,
							imageUrl: post.author.imageUrl,
							accountId: post.author.accountId,
							badge: post.author.badge
						},
						_count: {
							replies: post._count.replies
						}
					},
					replies: recursiveReplies,
					votes: {
						likes,
						dislikes,
						userVote
					}
				};
			};

			const thread = await fetchReplies(input.postId);
			return thread;
		})
});

export type RecursivePost = {
	post: {
		id: string;
		body: JSONContent | null;
		createdAt: Date;
		authorId: string;
		author: {
			id: string;
			createdAt: Date;
			updatedAt: Date;
			displayName: string;
			imageUrl: string | null;
			accountId: string;
			badge: string | null;
		};
		_count: {
			replies: number;
		};
	};
	replies: RecursivePost[];
	votes: {
		likes: number;
		dislikes: number;
		userVote: VoteType | null;
	};
};

export type FullPost = {
	post: {
		id: string;
		body: JSONContent | null;
		createdAt: Date;
		authorId: string;
		author: {
			id: string;
			createdAt: Date;
			updatedAt: Date;
			displayName: string;
			imageUrl: string | null;
			accountId: string;
			badge: string | null;
		};
		_count: {
			replies: number;
		};
	};
	votes: {
		likes: number;
		dislikes: number;
		userVote: VoteType | null;
	};
};

const getPostVotes = async (
	postId: string,
	userId: string | null | undefined,
	db: PrismaClient
) => {
	const votes = await db.vote.findMany({
		where: {
			postId: postId
		}
	});

	const likes = votes.filter((vote) => vote.type === VoteType.UP).length;
	const dislikes = votes.filter((vote) => vote.type === VoteType.DOWN).length;

	const userVote = votes.find((vote) => vote.userId === userId)?.type ?? null;
	console.log(userVote);

	return {
		likes,
		dislikes,
		userVote
	};
};

const getUserId = async (
	clerkUserId: string | null | undefined,
	db: PrismaClient
) => {
	let userId = null;
	if (clerkUserId) {
		const account = await db.account.findUnique({
			where: {
				clerkUserId: clerkUserId
			},
			include: {
				user: true
			}
		});

		userId = account?.user?.id;
	}

	return userId;
};
