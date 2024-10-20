import { VoteType } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const voteRouter = createTRPCRouter({
	getVotesByPostId: publicProcedure
		.input(z.object({ postId: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { db } = ctx;

			const likes = await db.vote.count({
				where: { postId: input.postId, type: VoteType.UP }
			});

			const dislikes = await db.vote.count({
				where: { postId: input.postId, type: VoteType.DOWN }
			});

			return { likes, dislikes };
		}),

	getVotesByPostIdWithUser: protectedProcedure
		.input(z.object({ postId: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { db } = ctx;

			const likes = await db.vote.count({
				where: { postId: input.postId, type: VoteType.UP }
			});

			const dislikes = await db.vote.count({
				where: { postId: input.postId, type: VoteType.DOWN }
			});

			const userVote = await db.vote.findFirst({
				where: { postId: input.postId, userId: ctx.user.id }
			});

			return { likes, dislikes, userVote };
		}),

	createVote: protectedProcedure
		.input(
			z.object({ postId: z.string(), type: z.nativeEnum(VoteType).nullable() })
		)
		.mutation(async ({ input, ctx }) => {
			const { db, user } = ctx;

			await db.vote.deleteMany({
				where: {
					postId: input.postId,
					userId: user.id
				}
			});

			if (!input.type) return;

			const vote = await db.vote.create({
				data: {
					postId: input.postId,
					type: input.type,
					userId: user.id
				}
			});

			return vote;
		})
});
