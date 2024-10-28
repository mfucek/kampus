import { publicProcedure } from '@/server/api/trpc';
import { VoteType } from '@prisma/client';
import { z } from 'zod';

export const getVotesByPostIdProcedure = publicProcedure
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
	});
