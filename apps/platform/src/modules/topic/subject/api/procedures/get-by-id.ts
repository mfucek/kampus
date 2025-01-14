import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';

export const getByIdProcedure = publicProcedure
	.input(z.object({ subjectId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const subjectRaw = await db.topic.findFirst({
			where: {
				id: input.subjectId,
				type: 'SUBJECT'
			},
			include: {
				College: true
			}
		});

		const numberOfDocuments = await db.documentFile.count({
			where: {
				Post: {
					topicId: input.subjectId
				}
			}
		});

		if (!subjectRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Subject not found'
			});
		}

		const subject = {
			...subjectRaw,
			college: subjectRaw.College,
			numberOfDocuments
		};

		return subject;
	});
