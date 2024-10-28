import { z } from 'zod';

import { VoteType } from '@prisma/client';

import { protectedProcedure } from '@/server/api/trpc';

export const createVoteProcedure = protectedProcedure
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
	});
