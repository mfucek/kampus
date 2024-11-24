import { type JSONContent } from '@tiptap/react';
import { z } from 'zod';

import { getFileUrl } from '@/lib/s3';
import { getUserId } from '@/modules/account/api/helpers/get-user-id';
import { publicProcedure } from '@/server/api/trpc';
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

		const filesWithUrls = await Promise.all(
			typesafePosts.map(async (post) =>
				Promise.all(
					post.files.map(async (file) => ({
						id: file.id,
						key: file.key,
						type: file.type,
						documentFile: file.documentFile
							? {
									academicYear: file.documentFile.academicYear ?? undefined,
									types: file.documentFile.types,
									title: file.documentFile.title ?? undefined
								}
							: null,
						imageFile: file.imageFile ? {} : null,
						url: await getFileUrl(file.key)
					}))
				)
			)
			// Start of Selection
		);

		const postsWithVotes = await Promise.all(
			typesafePosts.map(async (post, i) => ({
				post: post,
				votes: await getPostVotes(post.id, userId, db),
				files: filesWithUrls[i]!
			}))
		);

		return postsWithVotes;
	});
