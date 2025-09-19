import { type Prisma } from '@prisma/client';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';

export const listProgramsProcedure = publicProcedure
	.input(
		z.object({
			collegeId: z.string().optional()
		})
	)
	.query(async ({ ctx, input }) => {
		const { db } = ctx;

		const where: Prisma.TopicWhereInput = {
			type: 'PROGRAM',
			Program: {
				isNot: null
			},
			// scope
			...(input.collegeId ? { collegeId: input.collegeId } : {})
		};

		const programsRaw = await db.topic.findMany({
			where,
			include: {
				Program: {
					include: {
						_count: {
							select: {
								Subjects: true
							}
						}
					}
				},
				College: true,
				_count: {
					select: {
						Posts: true
					}
				}
			}
		});

		const programs = programsRaw.map((program) => {
			return {
				id: program.id,
				name: program.name,
				slug: program.slug,
				shortName: program.shortName,
				department: program.Program!.departments,
				type: program.Program!.type,
				link: `/${program.College.slug}/program/${program.slug}`,
				topLevelPosts: program._count.Posts,
				subjectsCount: program.Program?._count.Subjects
			};
		});

		return programs;
	});

export type ListProgramsItem = Awaited<
	ReturnType<typeof listProgramsProcedure>
>[number];
