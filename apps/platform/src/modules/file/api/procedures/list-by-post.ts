import { z } from 'zod';

import { publicProcedure } from '@/lib/trpc/trpc';

export const listByPostProcedure = publicProcedure
	.input(z.object({ postId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const filesRaw = await db.file.findMany({
			where: {
				DocumentFile: {
					postId: input.postId
				}
			},
			include: {
				DocumentFile: true,
				ImageFile: true
			}
		});

		const files = await Promise.all(
			filesRaw.map(async (file) => ({
				...file,
				documentFile: file.DocumentFile
			}))
		);

		return files;
	});
