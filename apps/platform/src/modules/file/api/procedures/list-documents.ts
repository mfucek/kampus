import { z } from 'zod';

import { type Prisma } from '@prisma/client';

import { getFileDownloadUrl } from '@/lib/s3/get-file-download-url';
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

		const where = {
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
						File: {
							authorId
						}
					}
				: {}),

			// post scope
			...(postId
				? {
						postId
					}
				: {}),

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
		} satisfies Prisma.DocumentFileWhereInput;

		const include = {
			File: true,
			Post: {
				include: {
					Votes: true,
					_count: {
						select: {
							Replies: true
						}
					}
				}
			}
		} satisfies Prisma.DocumentFileInclude;

		const documentFilesRaw = await db.documentFile.findMany({
			where,
			include,
			orderBy: {
				fileId: 'desc'
			},
			take: limit,
			skip: cursor ? 1 : 0,
			cursor: cursor ? { fileId: cursor } : undefined
		});

		const files = await Promise.all(
			documentFilesRaw.map(async (documentFile) => {
				const downloadUrl = await getFileDownloadUrl(documentFile.File.key);

				const documentData = {
					title: documentFile.title,
					academicYear: documentFile.academicYear,
					types: documentFile.types
				};

				const likes =
					documentFile.Post?.Votes.filter((vote) => vote.type === 'UP')
						.length ?? 0;
				const dislikes =
					documentFile.Post?.Votes.filter((vote) => vote.type === 'DOWN')
						.length ?? 0;
				const score = likes - dislikes;

				return {
					file: {
						id: documentFile.File.id,
						contentType: documentFile.File.contentType,
						size: documentFile.File.size,
						key: documentFile.File.key,
						createdAt: documentFile.File.createdAt
					},
					document: documentData,
					post: {
						id: documentFile.postId,
						replyCount: documentFile.Post?._count.Replies ?? 0
					},
					votes: {
						score
					},
					url: downloadUrl
				};
			})
		);

		const totalPages = Math.ceil(
			(await db.documentFile.count({
				where
			})) / limit
		);

		const nextCursor = documentFilesRaw[documentFilesRaw.length - 1]?.File.id;

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
