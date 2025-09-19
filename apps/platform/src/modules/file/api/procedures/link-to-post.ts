import { protectedProcedure } from '@/deps/trpc/trpc';
import { DocumentFileType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const linkToPostProcedure = protectedProcedure
	.input(
		z.object({
			files: z.array(
				z.object({
					key: z.string(),
					postId: z.string(),
					contentType: z.string(),
					size: z.number(),
					documentOptions: z.object({
						academicYear: z.string().optional(),
						title: z.string().optional(),
						types: z.array(z.nativeEnum(DocumentFileType))
					})
				})
			)
		})
	)
	.mutation(async ({ input, ctx }) => {
		const { db } = ctx;
		const { files } = input;

		for (const file of files) {
			if (!file.documentOptions) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Document options are required'
				});
			}

			// create document file
			try {
				await db.file.create({
					data: {
						key: file.key,
						contentType: file.contentType,
						size: file.size,
						authorId: ctx.user.id,
						ImageFile: undefined,
						DocumentFile: {
							create: {
								academicYear: file.documentOptions.academicYear,
								title: file.documentOptions.title,
								types: file.documentOptions.types,
								postId: file.postId
							}
						}
					}
				});
			} catch (error) {
				console.error(error);
			}
		}

		return { success: true };
	});
