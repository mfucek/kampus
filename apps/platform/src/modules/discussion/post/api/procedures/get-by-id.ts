import { type JSONContent } from '@tiptap/react';
import { z } from 'zod';

import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { optionalAuthMiddleware, publicProcedure } from '@/deps/trpc/trpc';
import { VoteType } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const getPostByIdProcedure = publicProcedure
	.use(optionalAuthMiddleware)
	.input(z.object({ postId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { user, db } = ctx;

		const postRaw = await db.post.findUnique({
			where: {
				id: input.postId
			},
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
			}
		});

		if (!postRaw) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
		}

		// DTOs

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

		const post = {
			id: postRaw.id,
			body: postRaw.body as JSONContent | null,
			createdAt: postRaw.createdAt,
			updatedAt: postRaw.updatedAt,
			replyToId: postRaw.replyToId,
			topicId: postRaw.topicId
		};

		const reactions = {
			up: upVotes,
			down: downVotes,
			sessionUserVote
		};

		const documents = await Promise.all(
			postRaw.DocumentFiles.map(async (documentRaw) => ({
				title: documentRaw.title,
				id: documentRaw.File.id,
				contentType: documentRaw.File.contentType,
				size: documentRaw.File.size,
				downloadUrl: await getFileDownloadUrl(documentRaw.File.key)
			}))
		);

		const author = {
			id: postRaw.authorId,
			name: postRaw.Author.name,
			imageUrl: profilePictureUrl,
			badge: postRaw.Author.badge
		};

		const repliesCount = postRaw._count.Replies;

		const link = `/post/${postRaw.id}`;

		return {
			post,
			reactions,
			documents,
			author,
			link,
			repliesCount
		};
	});

export type GetPostByIdItem = Awaited<ReturnType<typeof getPostByIdProcedure>>;
