import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { StaffGetItem } from './get-by-id';

export const staffsListByCollegeIdProcedure = publicProcedure
	.input(
		z.object({
			collegeId: z.string(),
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
				message: 'Subject not found'
			});
		}

		// get college's staffs

		const staffsRaw = await db.staff.findMany({
			where: {
				collegeId: input.collegeId
			},
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

		const totalStaffs = Math.ceil(
			(await db.staff.count({
				where: {
					collegeId: input.collegeId
				}
			})) / (limit ?? 10)
		);

		const nextCursor = staffsRaw[staffsRaw.length - 1]?.topicId;

		// DTOs

		const staffs = staffsRaw.map((staffRaw) => {
			const staff = {
				staffExternalLink: staffRaw.staffExternalLink,
				staffExternalCode: staffRaw.staffExternalCode
			} satisfies StaffGetItem['staff'];

			const topic = {
				id: staffRaw.Topic.id,
				name: staffRaw.Topic.name,
				slug: staffRaw.Topic.slug,
				type: staffRaw.Topic.type,
				shortName: staffRaw.Topic.shortName
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
				postsCount: staffRaw.Topic._count.Posts,
				link: `/${collegeRaw.Topic.slug}/staff/${staffRaw.Topic.slug}`,
				college: {
					topic: collegeTopic
				}
			};
		});

		return { staffs, ...(limit ? { nextCursor, totalStaffs } : {}) };
	});

export type ListStaffByCollegeIdItem = Awaited<
	ReturnType<typeof staffsListByCollegeIdProcedure>
>['staffs'][number];
