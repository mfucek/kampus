import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { subjectFiltersSchema } from '@/modules/topic/subject/schemas/subject-filters';
import { type Prisma } from '@prisma/client';
import { type SubjectGetItem } from './get-by-id';

export const subjectsListByCollegeIdProcedure = publicProcedure
	.input(
		z.object({
			collegeId: z.string(),
			filters: subjectFiltersSchema.optional(),
			// optional pagination
			cursor: z.string().nullish().optional(),
			limit: z.number().min(1).max(100).nullish().optional()
		})
	)
	.query(async ({ input, ctx }) => {
		const { db } = ctx;
		const { cursor } = input;
		const limit = input.limit;

		// check if college exists

		const collegeRaw = await db.college.findUnique({
			where: {
				topicId: input.collegeId
			},
			include: {
				Topic: true
			}
		});

		if (!collegeRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'College not found'
			});
		}

		// get program's subjects

		const where = {
			collegeId: input.collegeId,
			...(input.filters?.name
				? {
						Topic: {
							OR: [
								{
									name: { contains: input.filters.name, mode: 'insensitive' }
								},
								{
									shortName: {
										contains: input.filters.name,
										mode: 'insensitive'
									}
								},
								{
									slug: { contains: input.filters.name, mode: 'insensitive' }
								}
							]
						}
					}
				: {})
		} satisfies Prisma.SubjectWhereInput;

		const subjectsRaw = await db.subject.findMany({
			where,
			include: {
				Topic: {
					include: {
						_count: {
							select: {
								Posts: true
							}
						}
					}
				}
			},
			orderBy: {
				topicId: 'desc'
			},
			// optional pagination
			...(limit
				? {
						take: limit ?? 10,
						skip: cursor ? 1 : 0,
						cursor: cursor ? { topicId: cursor } : undefined
					}
				: {})
		});

		// optional pagination logic

		const totalSubjects = Math.ceil(
			(await db.subject.count({
				where
			})) / (limit ?? 10)
		);

		const nextCursor = subjectsRaw[subjectsRaw.length - 1]?.topicId;

		// DTOs

		const subjects = subjectsRaw.map(
			(subjectRaw) =>
				({
					subject: {
						ects: subjectRaw.ects,
						externalCodes: subjectRaw.externalCodes,
						externalLinks: subjectRaw.externalLinks
					} satisfies SubjectGetItem['subject'],
					topic: {
						name: subjectRaw.Topic.name,
						id: subjectRaw.Topic.id,
						type: subjectRaw.Topic.type,
						slug: subjectRaw.Topic.slug,
						shortName: subjectRaw.Topic.shortName
					} satisfies SubjectGetItem['topic'],
					college: {
						topic: {
							name: collegeRaw.Topic.name,
							id: collegeRaw.Topic.id,
							type: collegeRaw.Topic.type,
							slug: collegeRaw.Topic.slug,
							shortName: collegeRaw.Topic.shortName
						}
					} satisfies SubjectGetItem['college'],
					postsCount: subjectRaw.Topic._count.Posts,
					link: `/${collegeRaw.Topic.slug}/subject/${subjectRaw.Topic.slug}`
				}) satisfies Omit<SubjectGetItem, 'documentsCount'>
		);

		return { subjects, ...(limit ? { nextCursor, totalSubjects } : {}) };
	});

export type ListSubjectsByCollegeIdItem = Awaited<
	ReturnType<typeof subjectsListByCollegeIdProcedure>
>['subjects'][number];
