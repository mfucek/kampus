import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/deps/trpc/trpc';

export const subjectGetByIdProcedure = publicProcedure
	.input(z.object({ topicId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const subjectRaw = await db.subject.findFirst({
			where: {
				topicId: input.topicId,
				Topic: {
					type: 'SUBJECT'
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
			ects: subjectRaw.ects,
			externalCodes: subjectRaw.externalCodes,
			externalLinks: subjectRaw.externalLinks
		};

		const postsCount = await db.post.count({
			where: {
				topicId: input.topicId
			}
		});

		const documentsCount = await db.documentFile.count({
			where: {
				Post: {
					topicId: input.topicId
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

		const link = `/${subjectRaw.College.Topic.slug}/subject/${subjectRaw.Topic.slug}`;

		return {
			subject,
			topic,
			documentsCount,
			postsCount,
			link,
			college: { topic: collegeTopic }
		};
	});

export type SubjectGetItem = Awaited<
	ReturnType<typeof subjectGetByIdProcedure>
>;
