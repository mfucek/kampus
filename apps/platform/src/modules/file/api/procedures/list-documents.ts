import { z } from 'zod';

import { type Prisma } from '@prisma/client';

import { getFileUrl } from '@/lib/s3';
import { publicProcedure } from '@/server/api/trpc';
import { fileFiltersSchema } from '../../schemas/file-filters';
import { fileScopeSchema } from '../../schemas/file-scope';

const paginationSchema = z.object({
	limit: z.number().min(1).max(100).nullish(),
	cursor: z.string().nullish()
});

export const listDocumentsProcedure = publicProcedure
	.input(
		z
			.object({
				scope: fileScopeSchema,
				filters: fileFiltersSchema.nullish()
			})
			.merge(paginationSchema)
	)
	.query(async ({ input, ctx }) => {
		const { db } = ctx;
		const { scope, filters, cursor } = input;
		const limit = input.limit ?? 10;

		const collegeId = scope.collegeId;
		const topicId = scope.topicId;
		const authorId = scope.authorId;
		const postId = scope.postId;

		const where: Prisma.FileWhereInput = {
			// college scope
			...(collegeId
				? {
						Post: {
							collegeId
						}
					}
				: {}),

			// topic scope
			...(topicId
				? {
						Post: {
							topicId: topicId
						}
					}
				: {}),

			// author scope
			...(authorId
				? {
						authorId
					}
				: {}),

			// post scope
			...(postId
				? {
						postId
					}
				: {}),

			DocumentFile: {
				// name filter
				...(filters?.name
					? {
							title: {
								contains: filters.name,
								mode: 'insensitive'
							}
						}
					: {}),

				// document type filter
				...(filters?.documentTypes
					? {
							types: {
								hasEvery: filters.documentTypes
							}
						}
					: {})
			}
		};

		const include: Prisma.FileInclude = {
			DocumentFile: true
		};

		const filesRaw = await db.file.findMany({
			where,
			include,
			orderBy: {
				id: 'desc'
			},
			take: limit,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined
		});

		const files = await Promise.all(
			filesRaw.map(async (file) => {
				const downloadUrl = await getFileUrl(file.key);

				const documentData = {
					title: file.DocumentFile!.title,
					academicYear: file.DocumentFile!.academicYear,
					types: file.DocumentFile!.types
				};

				const originalPostId = file.postId;

				return {
					file: {
						id: file.id,
						createdAt: file.createdAt
					},
					document: documentData,
					post: {
						id: originalPostId
					},
					url: downloadUrl
				};
			})
		);

		const totalPages = Math.ceil(
			(await db.file.count({
				where
			})) / limit
		);

		const nextCursor = filesRaw[filesRaw.length - 1]?.id;

		const output = {
			files: files,
			nextCursor,
			totalPages
		};

		return output;
	});

export type ListDocumentsOutput = Awaited<
	ReturnType<typeof listDocumentsProcedure>
>;

export type ListDocumentsItem = ListDocumentsOutput['files'][number];
