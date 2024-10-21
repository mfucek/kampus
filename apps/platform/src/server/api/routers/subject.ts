import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const subjectRouter = createTRPCRouter({
	listByCollegeSlug: publicProcedure
		.input(z.object({ collegeSlug: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;

			const college = await db.college.findUnique({
				where: {
					slug: input.collegeSlug
				}
			});

			if (!college) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'College not found'
				});
			}

			const subjects = await db.topic.findMany({
				where: {
					collegeId: college.id,
					type: 'SUBJECT'
				},
				include: {
					college: true,
					subject: true,
					_count: {
						select: {
							Post: true
						}
					}
				}
			});

			return subjects;
		}),

	getBySlug: publicProcedure
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
		})
});
