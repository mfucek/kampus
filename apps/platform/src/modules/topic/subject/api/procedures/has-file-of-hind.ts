import { z } from 'zod';

import { protectedProcedure } from '@/server/api/trpc';
import { DocumentFileType } from '@prisma/client';
export const hasFileOfKindProcedure = protectedProcedure
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

		const filesRaw = await db.documentFile.findMany({
			where: {
				academicYear: year,
				types: {
					equals: types
				},
				File: {
					Post: {
						topicId: subjectId
					}
				}
			},
			include: {
				File: {
					include: {
						Post: {
							include: {
								Author: true
							}
						}
					}
				}
			}
		});

		const posts = filesRaw.map((file) => ({
			id: file.File.Post!.id,
			author: file.File.Post!.Author.displayName,
			createdAt: file.File.Post!.createdAt
		}));

		return posts.length > 0 ? posts : null;
	});
