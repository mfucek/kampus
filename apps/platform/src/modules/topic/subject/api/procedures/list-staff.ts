import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const listStaffProcedure = publicProcedure
	.input(z.object({ subjectId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const subjectRaw = await db.topic.findFirst({
			where: {
				id: input.subjectId
			}
		});

		if (!subjectRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Subject not found'
			});
		}

		const subjectStaffsRaw = await db.subjectStaff.findMany({
			where: {
				subjectId: subjectRaw.id
			},
			include: {
				Staff: {
					include: {
						Topic: {
							include: {
								College: true,
								_count: {
									select: {
										Posts: {
											where: {
												replyToId: null
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});

		if (!subjectStaffsRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'No staff found'
			});
		}

		const staff = subjectStaffsRaw.map((subjectStaff) => ({
			id: subjectStaff.Staff.Topic.id,
			name: subjectStaff.Staff.Topic.name,
			slug: subjectStaff.Staff.Topic.slug,
			staffRole: subjectStaff.staffRole,
			topLevelPosts: subjectStaff.Staff.Topic._count.Posts,
			link: `/${subjectStaff.Staff.Topic.College.slug}/staff/${subjectStaff.Staff.Topic.slug}`
		}));

		return staff;
	});

export type ListStaffItem = Awaited<
	ReturnType<typeof listStaffProcedure>
>[number];
