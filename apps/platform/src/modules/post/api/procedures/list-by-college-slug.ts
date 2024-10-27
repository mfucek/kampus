import { getFileUrl } from '@/lib/s3';
import { getUserId } from '@/modules/account/api/helpers/get-user-id';
import { FullPost } from '@/modules/post/types/full-post';
import { publicProcedure } from '@/server/api/trpc';
import { JSONContent } from '@tiptap/react';
import { z } from 'zod';
import { getPostVotes } from '../helpers/get-post-votes';

export const listPostsByCollegeSlugProcedure = publicProcedure
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

		const filesWithUrls = await Promise.all(
			typesafePosts.map(async (post) =>
				Promise.all(
					post.files.map(async (file) => ({
						id: file.id,
						key: file.key,
						type: file.type,
						documentFile: file.documentFile
							? {
									academicYear: file.documentFile.academicYear,
									types: file.documentFile.types
								}
							: null,
						imageFile: file.imageFile ? {} : null,
						url: await getFileUrl(file.key)
					}))
				)
			)
			// Start of Selection
		);

		const postsWithFiles: FullPost[] = await Promise.all(
			postsWithVotes.map(async (post, i) => ({
				post: post.post,
				votes: post.votes,
				files: filesWithUrls[i]!.map((file) => ({
					...file,
					documentFile: file.documentFile
						? {
								academicYear: file.documentFile.academicYear ?? '',
								types: file.documentFile.types
							}
						: null
				}))
			}))
		);

		return postsWithFiles;
	});
