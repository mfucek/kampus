import { z } from 'zod';

import { protectedProcedure } from '@/server/api/trpc';
import { Prisma, VoteType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
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
		if (!collegeId) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'College ID is required'
			});
		}

		const where: Prisma.PostWhereInput = {
			collegeId: collegeId,
			topicId: null,
			replyToId: null
		};

		const include: Prisma.PostInclude = {
			author: true,
			votes: true,
			_count: {
				select: {
					files: true,
					replies: true,
					votes: true
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

		const posts = postsRaw.map((post) => {
			const files = post.files;

			return {
				post: {
					id: post.id,
					body: post.body,
					createdAt: post.createdAt
				},
				votes: {
					likes: 1,
					dislikes: 1,
					userVote: VoteType.UP
				},
				files: files
			};
		});

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
