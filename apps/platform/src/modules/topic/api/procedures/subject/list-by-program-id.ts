import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { type SubjectGetItem } from './get-by-id';

export const subjectsListByProgramIdProcedure = publicProcedure
	.input(
		z.object({
			programId: z.string(),
			// optional pagination
			cursor: z.string().nullish().optional(),
			limit: z.number().min(1).max(100).nullish().optional()
		})
	)
	.query(async ({ input, ctx }) => {
		const { db } = ctx;
		const { cursor } = input;
		const limit = input.limit;

		// check if program exists

		const programRaw = await db.program.findUnique({
			where: {
				topicId: input.programId
			},
			include: {
				College: {
					include: {
						Topic: true
					}
				}
			}
		});

		if (!programRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Program not found'
			});
		}

		const collegeRaw = programRaw.College;

		// get program's subjects

		const programSubjectsRaw = await db.programSubject.findMany({
			where: {
				programId: input.programId
			},
			include: {
				Subject: {
					include: {
						Topic: {
							include: {
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
						_count: {
							select: {
								Staffs: true
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

		const totalSubjects = Math.ceil(
			(await db.programSubject.count({
				where: {
					programId: input.programId
				}
			})) / (limit ?? 10)
		);

		const nextCursor = programSubjectsRaw[programSubjectsRaw.length - 1]?.id;

		// DTOs

		const subjects = programSubjectsRaw.map((programSubject) => ({
			subject: {
				ects: programSubject.Subject.ects,
				externalCodes: programSubject.Subject.externalCodes,
				externalLinks: programSubject.Subject.externalLinks
			} satisfies SubjectGetItem['subject'],
			topic: {
				name: programSubject.Subject.Topic.name,
				id: programSubject.Subject.Topic.id,
				type: programSubject.Subject.Topic.type,
				slug: programSubject.Subject.Topic.slug,
				shortName: programSubject.Subject.Topic.shortName
			} satisfies SubjectGetItem['topic'],
			programSubject: {
				semester: programSubject.semester,
				groupName: programSubject.groupName
			},
			staffsCount: programSubject.Subject._count.Staffs,
			postsCount: programSubject.Subject.Topic._count.Posts,
			link: `/${collegeRaw.Topic.slug}/subject/${programSubject.Subject.Topic.slug}`
		}));

		return { subjects, ...(limit ? { nextCursor, totalSubjects } : {}) };
	});

export type ListSubjectsByProgramIdItem = Awaited<
	ReturnType<typeof subjectsListByProgramIdProcedure>
>['subjects'][number];
