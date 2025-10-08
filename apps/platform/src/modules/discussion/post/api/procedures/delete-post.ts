import { deleteFiles } from '@/deps/s3/delete-files';
import { protectedProcedure } from '@/deps/trpc/trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const deletePostProcedure = protectedProcedure
	.input(z.object({ postId: z.string() }))
	.mutation(async ({ input, ctx }) => {
		const { db } = ctx;

		const { deletedFiles } = await db.$transaction(async (tx) => {
			const post = await tx.post.findUnique({
				where: {
					id: input.postId
				}
			});

			if (!post) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' });
			}

			if (post.authorId !== ctx.user.id) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You are not allowed to delete this post'
				});
			}

			const fileIds = await tx.file.findMany({
				where: {
					DocumentFile: {
						postId: input.postId
					}
				}
			});

			await tx.documentFile.deleteMany({
				where: {
					File: {
						id: {
							in: fileIds.map((file) => file.id)
						}
					}
				}
			});

			await tx.file.deleteMany({
				where: {
					id: {
						in: fileIds.map((file) => file.id)
					}
				}
			});

			const replyCount = await tx.post.count({
				where: {
					replyToId: input.postId
				}
			});

			await tx.vote.deleteMany({
				where: {
					postId: input.postId
				}
			});

			// if post is a reply, delete any notifications it created
			await tx.notification.deleteMany({
				where: {
					postId: input.postId
				}
			});

			if (replyCount > 0) {
				// if post has replies, remove body

				await tx.post.update({
					where: {
						id: input.postId
					},
					data: {
						body: Prisma.DbNull
					}
				});

				return { deletedFiles: fileIds };
			} else {
				// if post has no replies, delete post

				await tx.post.delete({
					where: {
						id: input.postId
					}
				});

				return { deletedFiles: fileIds };
			}
		});

		// remove files from aws
		const deletedFileKeys = deletedFiles.map((file) => file.key);

		if (deletedFileKeys.length > 0) {
			await deleteFiles(deletedFileKeys);
		}

		return { success: true };
	});
