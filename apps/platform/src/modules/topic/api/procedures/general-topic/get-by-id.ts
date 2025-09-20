import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';

export const generalTopicGetByIdProcedure = publicProcedure
	.input(z.object({ topicId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const generalTopicRaw = await db.generalTopic.findUnique({
			where: {
				topicId: input.topicId,
				Topic: {
					type: 'GENERAL'
				}
			},
			include: {
				Topic: true
			}
		});

		if (!generalTopicRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'College not found'
			});
		}

		// DTOs

		const topic = {
			name: generalTopicRaw.Topic.name,
			id: generalTopicRaw.Topic.id,
			type: generalTopicRaw.Topic.type,
			slug: generalTopicRaw.Topic.slug,
			shortName: generalTopicRaw.Topic.shortName
		};

		const generalTopic = {
			icon: generalTopicRaw.icon
		};

		return { topic, generalTopic };
	});

export type GeneralTopicGetItem = Awaited<
	ReturnType<typeof generalTopicGetByIdProcedure>
>;
