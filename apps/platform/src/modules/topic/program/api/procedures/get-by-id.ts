import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';

export const getByIdProcedure = publicProcedure
	.input(z.object({ programId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const programRaw = await db.topic.findFirst({
			where: {
				id: input.programId,
				type: 'PROGRAM'
			},
			include: {
				College: true
			}
		});

		if (!programRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Program not found'
			});
		}

		const program = {
			...programRaw,
			college: programRaw.College
		};

		return program;
	});
