import { protectedProcedure } from '@/server/api/trpc';
import { DocumentFileType, FileType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const linkToPostProcedure = protectedProcedure
	.input(
		z.object({
			files: z.array(
				z.object({
					key: z.string(),
					type: z.nativeEnum(FileType),
					postId: z.string(),
					documentOptions: z
						.object({
							academicYear: z.string().optional(),
							title: z.string().optional(),
							types: z.array(z.nativeEnum(DocumentFileType))
						})
						.nullish()
				})
			)
		})
	)
	.mutation(async ({ input, ctx }) => {
		const { db } = ctx;
		const { files } = input;

		for (const file of files) {
			const { key, postId, type, documentOptions } = file;

			if (['PDF', 'ARCHIVE'].includes(type) && !documentOptions) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Document options are required'
				});
			}

			// create file
			try {
				await db.file.create({
					data: {
						key,
						postId,
						authorId: ctx.user.id,
						type,
						ImageFile: type === 'IMAGE' ? { create: {} } : undefined,
						DocumentFile: ['PDF', 'ARCHIVE'].includes(type)
							? {
									create: {
										academicYear: documentOptions!.academicYear,
										title: documentOptions!.title,
										types: documentOptions!.types
									}
								}
							: undefined
					}
				});
			} catch (error) {
				console.error(error);
			}
		}

		return { success: true };
	});
