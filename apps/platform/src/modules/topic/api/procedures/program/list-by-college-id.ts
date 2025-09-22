import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { type ProgramGetItem } from './get-by-id';

export const programsListByCollegeIdProcedure = publicProcedure
	.input(
		z.object({
			collegeId: z.string(),
			// optional pagination
			cursor: z.string().nullish().optional(),
			limit: z.number().min(1).max(100).nullish().optional()
		})
	)
	.query(async ({ ctx, input }) => {
		const { db } = ctx;
		const { cursor } = input;
		const limit = input.limit;

		// check if college exists

		const collegeRaw = await db.college.findFirst({
			where: {
				topicId: input.collegeId
			}
		});

		if (!collegeRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'College not found'
			});
		}

		// get programs

		const programsRaw = await db.program.findMany({
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
				},
				College: {
					include: {
						Topic: true
					}
				},
				_count: {
					select: {
						Subjects: true
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

		const totalPrograms = Math.ceil(
			(await db.program.count({
				where: {
					collegeId: input.collegeId
				}
			})) / (limit ?? 10)
		);

		const nextCursor = programsRaw[programsRaw.length - 1]?.topicId;

		// DTOs

		const programs = programsRaw.map((program) => {
			return {
				program: {
					departments: program.departments,
					type: program.type,
					programExternalCode: program.programExternalCode,
					programExternalLink: program.programExternalLink
				} satisfies ProgramGetItem['program'],
				topic: {
					name: program.Topic.name,
					id: program.Topic.id,
					type: program.Topic.type,
					slug: program.Topic.slug,
					shortName: program.Topic.shortName
				} satisfies ProgramGetItem['topic'],
				link: `/${program.College.Topic.slug}/program/${program.Topic.slug}`,
				subjectsCount: program._count.Subjects,
				postsCount: program.Topic._count.Posts
			};
		});

		return { programs, ...(limit ? { nextCursor, totalPrograms } : {}) };
	});

export type ListProgramsByCollegeIdItem = Awaited<
	ReturnType<typeof programsListByCollegeIdProcedure>
>['programs'][number];
