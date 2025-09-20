import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';

import { CollegeGetItem } from './get-by-id';

export const collegeGetBySlugProcedure = publicProcedure
	.input(z.object({ collegeSlug: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const collegeRaw = await db.college.findFirst({
			where: {
				Topic: {
					slug: input.collegeSlug,
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
		} satisfies CollegeGetItem['topic'];

		const college = {
			externalLinks: collegeRaw.externalLinks
		} satisfies CollegeGetItem['college'];

		return { topic, college } satisfies CollegeGetItem;
	});
