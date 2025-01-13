import { z } from 'zod';

import { protectedProcedure } from '@/server/api/trpc';
import { DocumentFileType } from '@prisma/client';
export const hasDocumentOfKindProcedure = protectedProcedure
	.input(
		z.object({
			types: z.array(
				z.enum(Object.values(DocumentFileType) as [DocumentFileType])
			),
			year: z.string(),
			subjectId: z.string()
		})
	)
	.query(async ({ input, ctx }) => {
		const { db } = ctx;
		const { types, year, subjectId } = input;

		const documentFilesRaw = await db.documentFile.findMany({
			where: {
				academicYear: year,
				types: {
					equals: types
				},
				Post: {
					topicId: subjectId
				}
			},
			include: {
				Post: {
					include: {
						Author: true
					}
				}
			}
		});

		const posts = documentFilesRaw.map((file) => ({
			id: file.Post!.id,
			author: file.Post!.Author.displayName,
			createdAt: file.Post!.createdAt
		}));

		return posts.length > 0 ? posts : null;
	});
