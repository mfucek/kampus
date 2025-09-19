import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/lib/trpc/trpc';

export const listSubjectsProcedure = publicProcedure
	.input(z.object({ programId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const programRaw = await db.topic.findFirst({
			where: {
				id: input.programId
			}
		});

		if (!programRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Program not found'
			});
		}

		const programSubjectsRaw = await db.programSubject.findMany({
			where: {
				programId: input.programId
			},
			include: {
				Subject: {
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
						},
						Staffs: {
							take: 3,
							include: {
								Staff: {
									include: {
										Topic: true
									}
								}
							}
						}
					}
				}
			}
		});

		if (!programSubjectsRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Program not found'
			});
		}

		const subjects = programSubjectsRaw.map((programSubject) => ({
			id: programSubject.Subject.Topic.id,
			name: programSubject.Subject.Topic.name,
			slug: programSubject.Subject.Topic.slug,
			ects: programSubject.Subject.ects,
			staffs: programSubject.Subject.Staffs.map(
				(staff) => staff.Staff.Topic.name
			),
			groupName: programSubject.groupName,
			semester: programSubject.semester,
			topLevelPosts: programSubject.Subject.Topic._count.Posts,
			staffCount: programSubject.Subject.Staffs.length,
			link: `/${programSubject.Subject.Topic.College.slug}/subject/${programSubject.Subject.Topic.slug}`
		}));

		return subjects;
	});

export type ListSubjectsOutput = Awaited<
	ReturnType<typeof listSubjectsProcedure>
>[number];
