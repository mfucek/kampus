import { protectedProcedure } from '@/lib/trpc/trpc';
import { VoteType } from '@prisma/client';
import { z } from 'zod';

export const getVotesByPostIdWithUserProcedure = protectedProcedure
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
	});
