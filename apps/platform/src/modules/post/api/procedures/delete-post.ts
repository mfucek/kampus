import { deleteFiles } from '@/lib/s3';
import { protectedProcedure } from '@/server/api/trpc';
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
					postId: input.postId
				}
			});

			await tx.imageFile.deleteMany({
				where: {
					file: {
						postId: input.postId
					}
				}
			});

			await tx.documentFile.deleteMany({
				where: {
					file: {
						postId: input.postId
					}
				}
			});

			await tx.file.deleteMany({
				where: {
					postId: input.postId
				}
			});

			const replyCount = await tx.post.count({
				where: {
					replyToId: input.postId
				}
			});

			if (replyCount > 0) {
				await tx.post.update({
					where: {
						id: input.postId
					},
					data: {
						body: Prisma.DbNull
					}
				});

				return { deletedFiles: fileIds };
			}

			await tx.vote.deleteMany({
				where: {
					postId: input.postId
				}
			});

			await tx.post.delete({
				where: {
					id: input.postId
				}
			});

			return { deletedFiles: fileIds };
		});

		// remove files from aws
		const deletedFileKeys = deletedFiles.map((file) => file.key);

		if (deletedFileKeys.length > 0) {
			await deleteFiles(deletedFileKeys);
		}
	});
