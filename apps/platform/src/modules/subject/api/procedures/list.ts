import { type Prisma } from '@prisma/client';
import { z } from 'zod';

import { getCollegeBySlug } from '@/modules/college/api/helpers/get-college-by-slug';
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
	});
