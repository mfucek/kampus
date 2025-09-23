import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { TRPCError } from '@trpc/server';

import { type GeneralTopicGetItem } from './get-by-id';

export const generalTopicGetBySlugProcedure = publicProcedure
	.input(z.object({ generalTopicSlug: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const generalTopicRaw = await db.generalTopic.findFirst({
			where: {
				Topic: {
					slug: input.generalTopicSlug,
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
			id: generalTopicRaw.Topic.id,
			slug: generalTopicRaw.Topic.slug,
			name: generalTopicRaw.Topic.name,
			shortName: generalTopicRaw.Topic.shortName,
			type: generalTopicRaw.Topic.type
		} satisfies GeneralTopicGetItem['topic'];

		const generalTopic = {
			icon: generalTopicRaw.icon
		} satisfies GeneralTopicGetItem['generalTopic'];

		return { topic, generalTopic } satisfies GeneralTopicGetItem;
	});
