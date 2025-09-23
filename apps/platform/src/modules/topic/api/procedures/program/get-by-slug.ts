import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { type ProgramGetItem } from './get-by-id';

export const programGetBySlugProcedure = publicProcedure
	.input(z.object({ programSlug: z.string(), collegeSlug: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const programRaw = await db.program.findFirst({
			where: {
				Topic: {
					slug: input.programSlug,
					type: 'PROGRAM'
				},
				College: {
					Topic: {
						slug: input.collegeSlug,
						type: 'COLLEGE'
					}
				}
			},
			include: {
				Topic: true,
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

		// DTOs

		const topic = {
			name: programRaw.Topic.name,
			id: programRaw.Topic.id,
			type: programRaw.Topic.type,
			slug: programRaw.Topic.slug,
			shortName: programRaw.Topic.shortName
		} satisfies ProgramGetItem['topic'];

		const program = {
			...programRaw.Topic,
			programExternalCode: programRaw.programExternalCode,
			programExternalLink: programRaw.programExternalLink,
			departments: programRaw.departments,
			type: programRaw.type
		} satisfies ProgramGetItem['program'];

		const collegeTopic = {
			...programRaw.College.Topic
		} satisfies ProgramGetItem['college']['topic'];

		return {
			program,
			topic,
			college: { topic: collegeTopic }
		} satisfies ProgramGetItem;
	});
