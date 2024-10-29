import { z } from 'zod';

import { getFileUrl } from '@/lib/s3';
import { protectedProcedure } from '@/server/api/trpc';
import { Prisma } from '@prisma/client';
import { postScopeSchema } from '../../schemas/post-scope';

const paginationSchema = z.object({
	limit: z.number().min(1).max(100).nullish(),
	cursor: z.string().nullish()
});

export const listProcedure = protectedProcedure
	.input(
		z
			.object({
				scope: postScopeSchema
			})
			.merge(paginationSchema)
	)
	.query(async ({ ctx, input }) => {
		const { db } = ctx;
		const { scope, cursor } = input;
		const limit = input.limit ?? 5;

		let collegeId = scope.college?.id;
		let topicId = scope.topic?.id;
		let replyToPostId = scope.replyToPost?.id;
		let authorId = scope.author?.id;

		// @TODO: needs more exclusive work to specify what kind of posts we want to get
		const where: Prisma.PostWhereInput = {
			...(collegeId ? { collegeId: collegeId } : {}),
			...(topicId ? { topicId: topicId } : { topicId: null }),
			...(replyToPostId ? { replyToId: replyToPostId } : { replyToId: null }),
			...(authorId ? { authorId: authorId } : {})
		};

		const include: Prisma.PostInclude = {
			author: true,
			votes: true,
			_count: {
				select: {
					files: true,
					replies: true
				}
			}
		};

		const postsRaw = await db.post.findMany({
			where,
			include,
			orderBy: {
				createdAt: 'desc'
			},
			take: limit,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined
		});

		const posts = await Promise.all(
			postsRaw.map(async (post) => {
				const votes = {
					likes: post.votes.filter((vote) => vote.type === 'UP').length,
					dislikes: post.votes.filter((vote) => vote.type === 'DOWN').length,
					userVote:
						post.votes.find((vote) => vote.userId === ctx.user.id)?.type ?? null
				};

				const filesRaw = await db.file.findMany({
					where: {
						postId: post.id
					},
					include: {
						documentFile: true,
						imageFile: true
					}
				});

				const files = await Promise.all(
					filesRaw.map(async (file) => ({
						id: file.id,
						type: file.type,
						key: file.key,
						documentFile: {
							academicYear: file.documentFile?.academicYear ?? undefined,
							title: file.documentFile?.title ?? undefined,
							types: file.documentFile?.types || []
						},
						imageFile: file.imageFile,
						url: await getFileUrl(file.key)
					}))
				);

				return {
					post: {
						id: post.id,
						body: post.body,
						createdAt: post.createdAt
					},
					votes: {
						likes: votes.likes,
						dislikes: votes.dislikes,
						userVote: votes.userVote
					},
					author: {
						id: post.author.id,
						displayName: post.author.displayName,
						imageUrl: post.author.imageUrl,
						badge: post.author.badge
					},
					replies: {
						count: post._count.replies
					},
					files: files
				};
			})
		);

		const totalPages = Math.ceil(
			(await db.post.count({
				where
			})) / limit
		);

		const nextCursor = posts[posts.length - 1]?.post.id;

		const output = {
			posts: posts,
			nextCursor,
			totalPages
		};

		return output;
	});

export type ListPostsOutput = Awaited<ReturnType<typeof listProcedure>>;

export type ListPostsItem = ListPostsOutput['posts'][number];

// cursor logic (get more replies on same level)

// number of files, file IDs
// number of replies, reply IDs
// votes
// author

// in frontend, data fetching layer
// <DynamicPost />
// is recursive
// has a cursor
// has a limit
