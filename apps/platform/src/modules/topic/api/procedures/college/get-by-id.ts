import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';

export const collegeGetByIdProcedure = publicProcedure
	.input(z.object({ topicId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const collegeRaw = await db.college.findUnique({
			where: {
				topicId: input.topicId,
				Topic: {
					type: 'COLLEGE'
				}
			},
			include: {
				Topic: true
			}
		});

		if (!collegeRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'College not found'
			});
		}

		// DTOs

		const topic = {
			name: collegeRaw.Topic.name,
			id: collegeRaw.Topic.id,
			type: collegeRaw.Topic.type,
			slug: collegeRaw.Topic.slug,
			shortName: collegeRaw.Topic.shortName
		};

		const college = {
			externalLinks: collegeRaw.externalLinks
		};

		return { topic, college };
	});

export type CollegeGetItem = Awaited<
	ReturnType<typeof collegeGetByIdProcedure>
>;
