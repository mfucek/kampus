import { type Prisma } from '@prisma/client';
import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';

export const listByDepartmentProcedure = publicProcedure
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

		const include: Prisma.TopicInclude = {
			Program: true
		};

		const programsRaw = await db.topic.findMany({ where, include });

		const programs = programsRaw.map((program) => {
			console.log(program.name, program.Program);

			return {
				id: program.id,
				name: program.name,
				slug: program.slug,
				shortName: program.shortName,
				department: program.Program!.departments,
				type: program.Program!.type
			};
		});

		return programs;
	});

export type ListByDepartmentItem = Awaited<
	ReturnType<typeof listByDepartmentProcedure>
>[number];
