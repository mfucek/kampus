import { getS3UploadPresignedUrl } from '@/lib/s3';
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure
} from '@/server/api/trpc';
import { DocumentFileType, FileType } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export const fileRouter = createTRPCRouter({
	getImage: publicProcedure
		.input(z.object({ imageFileId: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;
		}),

	getDocument: publicProcedure
		.input(z.object({ documentFileId: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;
		}),

	listByPost: publicProcedure
		.input(z.object({ postId: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;

			const files = await db.file.findMany({
				where: {
					postId: input.postId
				},
				include: {
					documentFile: true,
					imageFile: true
				}
			});

			const imageFiles = files
				.filter((file) => file.imageFile !== null)
				.map((file) => {});

			return files;
		}),

	makeUploadUrl: protectedProcedure //
		.mutation(async () => {
			const key = nanoid();
			const url = await getS3UploadPresignedUrl(key);
			return { url, key };
		}),

	linkToPost: protectedProcedure
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
				console.log('file', file);

				const { key, postId, type, documentOptions } = file;

				if (['PDF', 'ARCHIVE'].includes(type) && !documentOptions) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'Document options are required'
					});
				}

				console.log('creating file');

				// create file
				try {
					await db.file.create({
						data: {
							key,
							postId,
							authorId: ctx.user.id,
							type,
							imageFile: type === 'IMAGE' ? { create: {} } : undefined,
							documentFile: ['PDF', 'ARCHIVE'].includes(type)
								? {
										create: {
											academicYear: documentOptions!.academicYear,
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
		})
});
