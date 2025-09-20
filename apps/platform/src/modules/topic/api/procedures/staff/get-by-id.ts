import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';

export const staffGetByIdProcedure = publicProcedure
	.input(z.object({ topicId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const staffRaw = await db.staff.findFirst({
			where: {
				topicId: input.topicId,
				Topic: {
					type: 'STAFF'
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

		if (!staffRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Staff not found'
			});
		}

		// DTOs

		const topic = {
			name: staffRaw.Topic.name,
			id: staffRaw.Topic.id,
			type: staffRaw.Topic.type,
			slug: staffRaw.Topic.slug,
			shortName: staffRaw.Topic.shortName
		};

		const collegeTopic = {
			name: staffRaw.College.Topic.name,
			id: staffRaw.College.Topic.id,
			type: staffRaw.College.Topic.type,
			slug: staffRaw.College.Topic.slug,
			shortName: staffRaw.College.Topic.shortName
		};

		const staff = {
			staffExternalCode: staffRaw.staffExternalCode,
			staffExternalLink: staffRaw.staffExternalLink
		};

		return { staff, topic, college: { topic: collegeTopic } };
	});

export type StaffGetItem = Awaited<ReturnType<typeof staffGetByIdProcedure>>;
