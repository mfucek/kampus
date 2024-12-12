import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';

export const getBySlugProcedure = publicProcedure
	.input(z.object({ programSlug: z.string(), collegeSlug: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const programRaw = await db.topic.findFirst({
			where: {
				slug: input.programSlug,
				type: 'PROGRAM',
				College: {
					slug: input.collegeSlug
				}
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
