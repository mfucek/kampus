import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';

export const getByIdProcedure = publicProcedure
	.input(z.object({ collegeId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const college = await db.college.findUnique({
			where: {
				id: input.collegeId
			}
		});

		if (!college) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'College not found'
			});
		}

		return college;
	});
