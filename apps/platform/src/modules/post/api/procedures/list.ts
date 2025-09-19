import { type Prisma } from '@prisma/client';
import { z } from 'zod';

import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { optionalAuthMiddleware, publicProcedure } from '@/deps/trpc/trpc';
import { type JSONContent } from '@tiptap/react';
import { postScopeSchema } from '../../schemas/post-scope';
import { sortPostVotes } from '../helpers/get-post-votes';

const paginationSchema = z.object({
	limit: z.number().min(1).max(100).nullish(),
	cursor: z.string().nullish()
});

export const listProcedure = publicProcedure
	.use(optionalAuthMiddleware)
	.input(
		z
			.object({
				scope: postScopeSchema
			})
			.merge(paginationSchema)
	)
	.query(async ({ ctx, input }) => {
		const { auth, db } = ctx;
		const clerkUserId = auth?.userId;

		const { scope, cursor } = input;
		const limit = input.limit ?? 5;

		const user = clerkUserId
			? ((
					await db.account.findUnique({
						where: {
							clerkUserId: clerkUserId
						},
						include: {
							user: true
						}
					})
				)?.user ?? null)
			: null;

		const collegeId = scope.college?.id;
		const topicId = scope.topic?.id;
		const replyToPostId = scope.replyToPost?.id;
		const authorId = scope.author?.id;

		// @TODO: needs more exclusive work to specify what kind of posts we want to get
		const where: Prisma.PostWhereInput = {
			...(collegeId
				? { collegeId: collegeId, topicId: null, replyToId: null }
				: {}),
			...(topicId ? { topicId: topicId, replyToId: null } : {}),
			...(replyToPostId ? { replyToId: replyToPostId } : {}),
			...(authorId ? { authorId: authorId } : {}),
			hidden: false
		};

		const include = {
			Author: true,
			Votes: true,
			_count: {
				select: {
					DocumentFiles: true,
					Replies: true
				}
			}
		} satisfies Prisma.PostInclude;

		console.time('listProcedure');
		const postsRaw = await db.post.findMany({
			where,
			include,
			orderBy: {
				createdAt: 'desc'
			},
			take: limit,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined,
			relationLoadStrategy: 'join'
		});
		console.timeEnd('listProcedure');

		console.time('filesRaw');
		const documentFilesRaw = await db.documentFile.findMany({
			where: {
				postId: {
					in: postsRaw.map((post) => post.id)
				}
			},
			include: {
				File: true
			},
			relationLoadStrategy: 'join'
		});
		console.timeEnd('filesRaw');

		const posts = await Promise.all(
			postsRaw.map(async (post) => {
				// const filesRaw = await db.file.findMany({
				// 	where: {
				// 		postId: post.id
				// 	},
				// 	include: {
				// 		DocumentFile: true,
				// 		ImageFile: true
				// 	}
				// });

				const documentFiles = await Promise.all(
					documentFilesRaw
						.filter((fr) => fr.postId === post.id)
						.map(async (file) => ({
							fileId: file.File.id,
							contentType: file.File.contentType,
							size: file.File.size,
							key: file.File.key,
							academicYear: file.academicYear ?? null,
							title: file.title ?? null,
							types: file.types,
							url: await getFileDownloadUrl(file.File.key)
						}))
				);

				const votes = sortPostVotes(post.Votes, user?.id);

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
					votes: votes,
					author: {
						id: post.Author.id,
						displayName: post.Author.displayName,
						imageUrl: post.Author.imageUrl,
						badge: post.Author.badge
					},
					replies: {
						count: post._count.Replies
					},
					documentFiles: documentFiles
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
