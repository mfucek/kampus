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

			const staffs = await db.topic.findMany({
				where: {
					collegeId: college.id,
					type: 'STAFF'
				},
				include: {
					college: true,
					staff: true,
					_count: {
						select: {
							Post: true
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

	listBySubjectId: publicProcedure
		.input(z.object({ subjectId: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;

			const subject = await db.subject.findFirst({
				where: {
					topicId: input.subjectId
				}
			});

			if (!subject) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Subject not found'
				});
			}

			const staffs = await db.topic.findMany({
				where: {
					type: 'STAFF',
					staff: {
						subjects: {
							some: {
								topicId: subject.topicId
							}
						}
					}
				},
				include: {
					college: true,
					_count: {
						select: {
							Post: true
						}
					}
				}
			});

			return staffs;
		})
});
