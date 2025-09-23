import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';

export const programGetByIdProcedure = publicProcedure
	.input(z.object({ topicId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const programRaw = await db.program.findFirst({
			where: {
				topicId: input.topicId,
				Topic: {
					type: 'PROGRAM'
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
		};

		const collegeTopic = {
			name: programRaw.College.Topic.name,
			id: programRaw.College.Topic.id,
			slug: programRaw.College.Topic.slug,
			type: programRaw.College.Topic.type,
			shortName: programRaw.College.Topic.shortName
		};

		const program = {
			programExternalCode: programRaw.programExternalCode,
			programExternalLink: programRaw.programExternalLink,
			departments: programRaw.departments,
			type: programRaw.type
		};

		return { program, topic, college: { topic: collegeTopic } };
	});

export type ProgramGetItem = Awaited<
	ReturnType<typeof programGetByIdProcedure>
>;
