import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';
import { SubjectGetItem } from './get-by-id';

export const subjectGetBySlugProcedure = publicProcedure
	.input(z.object({ subjectSlug: z.string(), collegeSlug: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const subjectRaw = await db.subject.findFirst({
			where: {
				Topic: {
					slug: input.subjectSlug,
					type: 'SUBJECT'
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

		if (!subjectRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Subject not found'
			});
		}

		// DTOs

		const topic = {
			name: subjectRaw.Topic.name,
			id: subjectRaw.Topic.id,
			type: subjectRaw.Topic.type,
			slug: subjectRaw.Topic.slug,
			shortName: subjectRaw.Topic.shortName
		};

		const subject = {
			...subjectRaw.Topic,
			ects: subjectRaw.ects,
			externalCodes: subjectRaw.externalCodes,
			externalLinks: subjectRaw.externalLinks
		} satisfies SubjectGetItem['subject'];

		const numberOfDocuments = await db.documentFile.count({
			where: {
				Post: {
					topicId: subjectRaw.Topic.id
				}
			}
		});

		const collegeTopic = {
			name: subjectRaw.College.Topic.name,
			id: subjectRaw.College.Topic.id,
			type: subjectRaw.College.Topic.type,
			slug: subjectRaw.College.Topic.slug,
			shortName: subjectRaw.College.Topic.shortName
		};

		return {
			subject,
			topic,
			numberOfDocuments,
			college: { topic: collegeTopic }
		} satisfies SubjectGetItem;
	});
