import { type Prisma } from '@prisma/client';
import { z } from 'zod';

import { getFileUrl } from '@/lib/s3';
import { protectedProcedure } from '@/server/api/trpc';
import { JSONContent } from '@tiptap/react';
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
			...(collegeId
				? { collegeId: collegeId, topicId: null, replyToId: null }
				: {}),
			...(topicId ? { topicId: topicId, replyToId: null } : {}),
			...(replyToPostId ? { replyToId: replyToPostId } : {}),
			...(authorId ? { authorId: authorId } : {})
		};

		const include: Prisma.PostInclude = {
			Author: true,
			Votes: true,
			_count: {
				select: {
					Files: true,
					Replies: true
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
					likes: post.Votes.filter((vote) => vote.type === 'UP').length,
					dislikes: post.Votes.filter((vote) => vote.type === 'DOWN').length,
					userVote:
						post.Votes.find((vote) => vote.userId === ctx.user.id)?.type ?? null
				};

				const filesRaw = await db.file.findMany({
					where: {
						postId: post.id
					},
					include: {
						DocumentFile: true,
						ImageFile: true
					}
				});

				const files = await Promise.all(
					filesRaw.map(async (file) => ({
						id: file.id,
						type: file.type,
						key: file.key,
						documentFile: {
							academicYear: file.DocumentFile?.academicYear ?? undefined,
							title: file.DocumentFile?.title ?? undefined,
							types: file.DocumentFile?.types || []
						},
						imageFile: file.ImageFile,
						url: await getFileUrl(file.key)
					}))
				);

				return {
					post: {
						id: post.id,
						body: post.body as JSONContent,
						createdAt: post.createdAt,
						updatedAt: post.updatedAt,
						collegeId: post.collegeId,
						topicId: post.topicId,
						replyToId: post.replyToId,
						authorId: post.authorId,
						_count: {
							replies: post._count.Replies
						},
						author: {
							id: post.Author.id,
							displayName: post.Author.displayName,
							imageUrl: post.Author.imageUrl,
							badge: post.Author.badge
						}
					},
					votes: {
						likes: votes.likes,
						dislikes: votes.dislikes,
						userVote: votes.userVote
					},
					author: {
						id: post.Author.id,
						displayName: post.Author.displayName,
						imageUrl: post.Author.imageUrl,
						badge: post.Author.badge
					},
					replies: {
						count: post._count.Replies
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
