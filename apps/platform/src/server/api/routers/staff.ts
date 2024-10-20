import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const staffRouter = createTRPCRouter({
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

			const staffs = await db.staff.findMany({
				where: {
					topic: {
						collegeId: college.id
					}
				},
				include: {
					topic: {
						include: {
							college: true
						}
					}
				}
			});

			if (!staffs) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Subjects not found'
				});
			}

			return staffs;
		}),

	getBySlug: publicProcedure
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
		}),

	listBySubjectSlug: publicProcedure
		.input(z.object({ subjectSlug: z.string(), collegeSlug: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;

			const subject = await db.subject.findFirst({
				where: {
					topic: {
						slug: input.subjectSlug,
						type: 'SUBJECT',
						college: { slug: input.collegeSlug }
					}
				}
			});

			if (!subject) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Subject not found'
				});
			}

			const staffs = await db.staff.findMany({
				where: {
					subjects: {
						some: {
							topicId: subject.topicId
						}
					}
				},
				include: {
					topic: {
						include: {
							college: true
						}
					}
				}
			});

			return staffs;
		})
});
