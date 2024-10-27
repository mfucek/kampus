import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { type Prisma, type PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const subjectScopeSchema = z.object({
	collegeSlug: z.string().nullish(),
	collegeId: z.string().nullish(),
	staffId: z.string().nullish()
});

const subjectFiltersSchema = z.object({
	name: z.string().nullish()
	//
});

export type TSubjectScope = z.infer<typeof subjectScopeSchema>;
export type TSubjectFilters = z.infer<typeof subjectFiltersSchema>;

export const subjectRouter = createTRPCRouter({
	list: publicProcedure
		.input(
			z.object({
				limit: z.number().max(100).nullish(),
				cursor: z.string().nullish(),
				filters: subjectFiltersSchema.nullish(),
				scope: subjectScopeSchema.nullish()
			})
		)
		.query(async ({ input, ctx }) => {
			const { db } = ctx;
			const { cursor } = input;
			const limit = input.limit ?? 10;

			const collegeId =
				input.scope?.collegeId ??
				(input.scope?.collegeSlug
					? (await getCollegeBySlug(db, input.scope?.collegeSlug)).id
					: undefined);

			const staffId = input.scope?.staffId;

			const where: Prisma.TopicWhereInput = {
				type: 'SUBJECT',
				// scope
				...(collegeId ? { collegeId: collegeId } : {}),
				...(staffId
					? {
							subject: {
								staffs: {
									some: {
										topicId: staffId
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

			const subjects = await db.topic.findMany({
				where,
				include: {
					college: true,
					subject: true,
					_count: {
						select: {
							posts: true
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

			const totalSubjects = Math.ceil(
				(await db.topic.count({
					where
				})) / limit
			);

			const nextCursor = subjects[subjects.length - 1]?.id;

			return { subjects, nextCursor, totalSubjects };
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
