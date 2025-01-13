import { type Prisma } from '@prisma/client';
import { z } from 'zod';

import { getCollegeBySlug } from '@/modules/topic/college/api/helpers/get-college-by-slug';
import { publicProcedure } from '@/server/api/trpc';
import { subjectFiltersSchema } from '../../schemas/subject-filters';
import { subjectScopeSchema } from '../../schemas/subject-scope';

export const listProcedure = publicProcedure
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
		const limit = input.limit;

		const collegeId =
			input.scope?.collegeId ??
			(input.scope?.collegeSlug
				? (await getCollegeBySlug(db, input.scope?.collegeSlug)).id
				: undefined);

		const programId = input.scope?.programId;

		const staffId = input.scope?.staffId;

		const where: Prisma.TopicWhereInput = {
			type: 'SUBJECT',
			// scope
			...(collegeId ? { collegeId: collegeId } : {}),
			...(programId
				? { Subject: { Programs: { some: { programId: programId } } } }
				: {}),
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

		const subjectsRaw = await db.topic.findMany({
			where,
			include: {
				College: true,
				Subject: true,
				_count: {
					select: {
						Posts: true
					}
				}
			},
			orderBy: {
				id: 'desc'
			},
			...(limit
				? {
						take: limit,
						skip: cursor ? 1 : 0,
						cursor: cursor
							? {
									id: cursor
								}
							: undefined
					}
				: {})
		});

		const subjects = await Promise.all(
			subjectsRaw.map(async (subject) => ({
				college: subject.College,
				subject: subject.Subject,
				_count: {
					posts: subject._count.Posts
				},
				id: subject.id,
				name: subject.name,
				shortName: subject.shortName,
				externalCode: '',
				type: subject.type,
				slug: subject.slug,
				collegeId: subject.collegeId
			}))
		);

		const totalSubjects = Math.ceil(
			(await db.topic.count({
				where
			})) / (limit ?? 1)
		);

		const nextCursor = subjects[subjects.length - 1]?.id;

		return { subjects, nextCursor, totalSubjects };
	});

export type SubjectListItem = Awaited<
	ReturnType<typeof listProcedure>
>['subjects'][number];
