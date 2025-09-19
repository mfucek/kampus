import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';

export const getBySlugProcedure = publicProcedure
	.input(z.object({ subjectSlug: z.string(), collegeSlug: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const subjectRaw = await db.topic.findFirst({
			where: {
				slug: input.subjectSlug,
				type: 'SUBJECT',
				College: {
					slug: input.collegeSlug
				}
			},
			include: {
				College: true
			}
		});

		if (!subjectRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Subject not found'
			});
		}

		const subject = {
			...subjectRaw,
			college: subjectRaw.College
		};

		return subject;
	});
