import { publicProcedure } from '@/server/api/trpc';
import { type Prisma } from '@prisma/client';
import { z } from 'zod';
import { getCollegeBySlug } from '../../../college/api/helpers/get-college-by-slug';
import { staffFiltersSchema } from '../../schemas/staff-filters';
import { staffScopeSchema } from '../../schemas/staff-scope';

export const listProcedure = publicProcedure
	.input(
		z.object({
			limit: z.number().min(1).max(100).nullish(),
			cursor: z.string().nullish(),
			filters: staffFiltersSchema.nullish(),
			scope: staffScopeSchema.nullish()
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

		const subjectId = input.scope?.subjectId;

		const where: Prisma.TopicWhereInput = {
			type: 'STAFF',
			// scope
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

		const staffRaw = await db.topic.findMany({
			where,
			include: {
				College: true,
				Staff: true,
				_count: {
					select: {
						Posts: true
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

		const staffs = await Promise.all(
			staffRaw.map(async (staff) => ({
				college: staff.College,
				staff: staff.Staff,
				_count: {
					posts: staff._count.Posts
				},
				name: staff.name,
				type: staff.type,
				collegeId: staff.collegeId,
				id: staff.id,
				slug: staff.slug,
				shortName: staff.shortName
			}))
		);

		const totalStaffs = Math.ceil(
			(await db.topic.count({
				where
			})) / limit
		);

		const nextCursor = staffs[staffs.length - 1]?.id;

		return { staffs, nextCursor, totalStaffs };
	});
