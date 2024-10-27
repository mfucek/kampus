import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';

export const getBySlugProcedure = publicProcedure
	.input(z.object({ staffSlug: z.string(), collegeSlug: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const staff = await db.topic.findFirst({
			where: {
				slug: input.staffSlug,
				type: 'STAFF',
				college: {
					slug: input.collegeSlug
				}
			},
			include: {
				college: true
			}
		});

		if (!staff) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Subject not found'
			});
		}

		return staff;
	});
