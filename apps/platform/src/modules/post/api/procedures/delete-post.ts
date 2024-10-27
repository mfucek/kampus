import { protectedProcedure } from '@/server/api/trpc';
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const deletePostProcedure = protectedProcedure
	.input(z.object({ postId: z.string() }))
	.mutation(async ({ input, ctx }) => {
		const { db } = ctx;

		const post = await db.post.findUnique({
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

		const replyCount = await db.post.count({
			where: {
				replyToId: input.postId
			}
		});

		if (replyCount > 0) {
			await db.post.update({
				where: {
					id: input.postId
				},
				data: {
					body: Prisma.DbNull
				}
			});

			return;
		}

		await db.vote.deleteMany({
			where: {
				postId: input.postId
			}
		});

		await db.post.delete({
			where: {
				id: input.postId
			}
		});
	});
