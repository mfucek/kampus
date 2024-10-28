import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';

export const getBySlugProcedure = publicProcedure
	.input(z.object({ subjectSlug: z.string(), collegeSlug: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const subject = await db.topic.findFirst({
			where: {
				slug: input.subjectSlug,
				type: 'SUBJECT',
				college: {
					slug: input.collegeSlug
				}
			},
			include: {
				college: true
			}
		});

		if (!subject) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Subject not found'
			});
		}

		return subject;
	});
