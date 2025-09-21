import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { StaffGetItem } from './get-by-id';

export const staffGetBySlugProcedure = publicProcedure
	.input(z.object({ staffSlug: z.string(), collegeSlug: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const staffRaw = await db.staff.findFirst({
			where: {
				Topic: {
					slug: input.staffSlug,
					type: 'STAFF'
				},
				College: {
					Topic: {
						slug: input.collegeSlug
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

		if (!staffRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Subject not found'
			});
		}

		// DTOs

		const topic = {
			type: staffRaw.Topic.type,
			id: staffRaw.Topic.id,
			slug: staffRaw.Topic.slug,
			name: staffRaw.Topic.name,
			shortName: staffRaw.Topic.shortName
		} satisfies StaffGetItem['topic'];

		const postsCount = await db.post.count({
			where: {
				topicId: staffRaw.Topic.id
			}
		});

		const staff = {
			staffExternalCode: staffRaw.staffExternalCode,
			staffExternalLink: staffRaw.staffExternalLink
		} satisfies StaffGetItem['staff'];

		const collegeTopic = {
			name: staffRaw.College.Topic.name,
			id: staffRaw.College.Topic.id,
			type: staffRaw.College.Topic.type,
			slug: staffRaw.College.Topic.slug,
			shortName: staffRaw.College.Topic.shortName
		} satisfies StaffGetItem['college']['topic'];

		return {
			staff,
			topic,
			college: { topic: collegeTopic },
			postsCount,
			link: `/${staffRaw.College.Topic.slug}/staff/${staffRaw.Topic.slug}`
		} satisfies StaffGetItem;
	});
