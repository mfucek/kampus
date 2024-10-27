import { z } from 'zod';

import { getUserId } from '@/modules/account/api/helpers/get-user-id';
import { publicProcedure } from '@/server/api/trpc';
import { JSONContent } from '@tiptap/react';
import { getPostVotes } from '../helpers/get-post-votes';

export const getTopicPostsByIdProcedure = publicProcedure
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
				author: true,
				files: {
					include: {
						documentFile: true,
						imageFile: true
					}
				}
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
	});
