import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { StaffGetItem } from './get-by-id';

export const staffsListBySubjectIdProcedure = publicProcedure
	.input(
		z.object({
			subjectId: z.string(),
			// optional pagination
			cursor: z.string().nullish().optional(),
			limit: z.number().min(1).max(100).nullish().optional()
		})
	)
	.query(async ({ input, ctx }) => {
		const { db } = ctx;
		const { cursor } = input;
		const limit = input.limit;

		// check if subject exists

		const subjectRaw = await db.subject.findUnique({
			where: {
				topicId: input.subjectId
			},
			include: {
				College: {
					include: {
						Topic: true
					}
				}
			}
		});

		if (!subjectRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Subject not found'
			});
		}

		const collegeRaw = subjectRaw.College;

		// get subject's staffs

		const subjectStaffsRaw = await db.subjectStaff.findMany({
			where: {
				subjectId: input.subjectId
			},
			include: {
				Staff: {
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
					}
				}
			},
			orderBy: {
				id: 'desc'
			},
			// optional pagination
			...(limit
				? {
						take: limit ?? 10,
						skip: cursor ? 1 : 0,
						cursor: cursor ? { id: cursor } : undefined
					}
				: {})
		});

		// optional pagination logic

		const totalStaffs = Math.ceil(
			(await db.subjectStaff.count({
				where: {
					subjectId: input.subjectId
				}
			})) / (limit ?? 10)
		);

		const nextCursor = subjectStaffsRaw[subjectStaffsRaw.length - 1]?.id;

		// DTOs

		const staffs = subjectStaffsRaw.map((subjectStaff) => {
			const staff = {
				staffExternalLink: subjectStaff.Staff.staffExternalLink,
				staffExternalCode: subjectStaff.Staff.staffExternalCode
			} satisfies StaffGetItem['staff'];

			const topic = {
				id: subjectStaff.Staff.Topic.id,
				name: subjectStaff.Staff.Topic.name,
				slug: subjectStaff.Staff.Topic.slug,
				type: subjectStaff.Staff.Topic.type,
				shortName: subjectStaff.Staff.Topic.shortName
			} satisfies StaffGetItem['topic'];

			const collegeTopic = {
				name: collegeRaw.Topic.name,
				id: collegeRaw.Topic.id,
				type: collegeRaw.Topic.type,
				slug: collegeRaw.Topic.slug,
				shortName: collegeRaw.Topic.shortName
			} satisfies StaffGetItem['college']['topic'];

			return {
				staff,
				topic,
				subjectStaff: {
					staffRole: subjectStaff.staffRole
				},
				postsCount: subjectStaff.Staff.Topic._count.Posts,
				link: `/${collegeRaw.Topic.slug}/staff/${subjectStaff.Staff.Topic.slug}`,
				college: { topic: collegeTopic }
			};
		});

		return { staffs, ...(limit ? { nextCursor, totalStaffs } : {}) };
	});

export type ListStaffBySubjectIdItem = Awaited<
	ReturnType<typeof staffsListBySubjectIdProcedure>
>['staffs'][number];
