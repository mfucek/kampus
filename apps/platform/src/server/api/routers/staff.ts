import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { type Prisma, type PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const staffSubsetSchema = z.object({
	collegeSlug: z.string().nullish(),
	collegeId: z.string().nullish(),
	subjectId: z.string().nullish()
});

const staffFiltersSchema = z.object({
	name: z.string().nullish(),
	subject: z.string().nullish()
});

export type TStaffSubset = z.infer<typeof staffSubsetSchema>;
export type TStaffFilters = z.infer<typeof staffFiltersSchema>;

export const staffRouter = createTRPCRouter({
	list: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish(),
				filters: staffFiltersSchema.nullish(),
				subset: staffSubsetSchema.nullish()
			})
		)
		.query(async ({ input, ctx }) => {
			const { db } = ctx;
			const { cursor } = input;
			const limit = input.limit ?? 10;

			const collegeId =
				input.subset?.collegeId ??
				(input.subset?.collegeSlug
					? (await getCollegeBySlug(db, input.subset?.collegeSlug)).id
					: undefined);

			const subjectId = input.subset?.subjectId;

			const where: Prisma.TopicWhereInput = {
				type: 'STAFF',
				// subset
				...(collegeId ? { collegeId: collegeId } : {}),
				...(subjectId
					? {
							staff: {
								subjects: {
									some: {
										topicId: subjectId
									}
								}
							}
						}
					: {}),
				// or filters
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
