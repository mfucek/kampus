import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { Prisma, PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const staffRouter = createTRPCRouter({
	listByCollegeSlug: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(),
				collegeSlug: z.string(),
				filters: z
					.object({
						name: z.string().nullish(),
						subject: z.string().nullish()
					})
					.nullish()
			})
		)
		.query(async ({ input, ctx }) => {
			const { db } = ctx;
			const { cursor } = input;
			const limit = input.limit ?? 10;

			const college = await getCollegeBySlug(db, input.collegeSlug);

			const where: Prisma.TopicWhereInput = {
				collegeId: college.id,
				type: 'STAFF',
				...(input.filters?.name && {
					OR: [
						{
							name: {
								contains: input.filters.name,
								mode: 'insensitive'
							}
						},
						{
							slug: {
								contains: input.filters.name,
								mode: 'insensitive'
							}
						}
					]
				})
			};

			const staffs = await db.topic.findMany({
				where,
				include: {
					college: true,
					staff: true,
					_count: {
						select: {
							Post: true
						}
					}
				},
				orderBy: {
					id: 'desc'
				},
				take: limit,
				skip: cursor ? 1 : 0,
				cursor: cursor
					? {
							id: cursor
						}
					: undefined
			});

			const totalStaffs = Math.ceil(
				(await db.topic.count({
					where
				})) / limit
			);

			if (!staffs) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Subjects not found'
				});
			}

			const nextCursor = staffs[staffs.length - 1]?.id;

			return { staffs, nextCursor, totalStaffs };
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

const getCollegeBySlug = async (db: PrismaClient, slug: string) => {
	const college = await db.college.findUnique({
		where: { slug }
	});

	if (!college) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'College not found'
		});
	}

	return college;
};
