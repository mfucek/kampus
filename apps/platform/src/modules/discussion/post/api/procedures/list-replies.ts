import { type Prisma, VoteType } from '@prisma/client';
import { type JSONContent } from '@tiptap/react';
import z from 'zod';

import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { publicProcedure } from '@/deps/trpc/trpc';
import { type GetPostByIdItem } from './get-by-id';

export const listRepliesProcedure = publicProcedure
	.input(
		z.object({
			postId: z.string(),
			// optional pagination
			cursor: z.string().nullish().optional(),
			limit: z.number().min(1).max(100).nullish().optional()
		})
	)
	.query(async ({ input, ctx }) => {
		const { db, user } = ctx;
		const { postId } = input;
		const { cursor } = input;
		const limit = input.limit;

		const where: Prisma.PostWhereInput = {
			replyToId: postId
		};

		const postsRaw = await db.post.findMany({
			where,
			include: {
				Author: {
					include: {
						ImageFile: {
							include: {
								File: true
							}
						}
					}
				},
				DocumentFiles: {
					include: {
						File: true
					}
				},
				Votes: {
					select: {
						type: true,
						userId: true
					}
				},
				_count: {
					select: {
						Replies: true
					}
				}
			},
			// optional pagination
			orderBy: {
				createdAt: 'asc'
			},
			...(limit
				? {
						take: limit ?? 10,
						skip: cursor ? 1 : 0,
						cursor: cursor ? { id: cursor } : undefined
					}
				: {})
		});

		// optional pagination logic

		const totalStaffs = Math.ceil(
			(await db.post.count({
				where
			})) / (limit ?? 10)
		);

		const nextCursor = postsRaw[postsRaw.length - 1]?.id;

		// DTOs

		const posts = await Promise.all(
			postsRaw.map(async (postRaw) => {
				const upVotes = postRaw.Votes.filter(
					(vote) => vote.type === VoteType.UP
				).length;
				const downVotes = postRaw.Votes.filter(
					(vote) => vote.type === VoteType.DOWN
				).length;

				let sessionUserVote = null;
				if (user) {
					sessionUserVote =
						postRaw.Votes.find((vote) => vote.userId === user.id)?.type ?? null;
				}

				const profilePictureKey = postRaw.Author.ImageFile?.File.key;
				const profilePictureUrl = profilePictureKey
					? await getFileDownloadUrl(profilePictureKey)
					: null;

				const link = `/post/${postRaw.id}`;

				return {
					post: {
						id: postRaw.id,
						body: postRaw.body as JSONContent,
						createdAt: postRaw.createdAt,
						updatedAt: postRaw.updatedAt,
						replyToId: postRaw.replyToId,
						topicId: postRaw.topicId
					} satisfies GetPostByIdItem['post'],
					reactions: {
						up: upVotes,
						down: downVotes,
						sessionUserVote
					} satisfies GetPostByIdItem['reactions'],
					documents: (await Promise.all(
						postRaw.DocumentFiles.map(async (documentRaw) => ({
							title: documentRaw.title,
							id: documentRaw.File.id,
							contentType: documentRaw.File.contentType,
							size: documentRaw.File.size,
							downloadUrl: await getFileDownloadUrl(documentRaw.File.key)
						}))
					)) satisfies GetPostByIdItem['documents'],
					author: {
						id: postRaw.authorId,
						name: postRaw.Author.name,
						imageUrl: profilePictureUrl,
						badge: postRaw.Author.badge
					} satisfies GetPostByIdItem['author'],
					repliesCount: postRaw._count.Replies,
					link
				} satisfies GetPostByIdItem;
			})
		);

		return { posts, ...(limit ? { nextCursor, totalStaffs } : {}) };
	});

export type PostListRepliesItem = Awaited<
	ReturnType<typeof listRepliesProcedure>
>['posts'][number];
