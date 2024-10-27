import { z } from 'zod';

import { protectedProcedure } from '@/server/api/trpc';
import { Prisma, VoteType } from '@prisma/client';
import { postScopeSchema } from '../../schemas/post-scope';

export const listProcedure = protectedProcedure
	.input(
		z.object({
			scope: postScopeSchema,
			fields: z.object({
				replies: z.boolean().nullish()
			})
		})
	)
	.query(async ({ ctx }) => {
		const { db } = ctx;

		const where: Prisma.PostWhereInput = {};

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
			include
		});

		const posts = postsRaw.map((post) => {
			const files = post.files;

			const output = {
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

			return output;
		});
	});

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
