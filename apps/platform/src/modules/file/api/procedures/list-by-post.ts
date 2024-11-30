import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';

export const listByPostProcedure = publicProcedure
	.input(z.object({ postId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;

		const filesRaw = await db.file.findMany({
			where: {
				postId: input.postId
			},
			include: {
				DocumentFile: true,
				ImageFile: true
			}
		});

		const files = await Promise.all(
			filesRaw.map(async (file) => ({
				...file,
				documentFile: file.DocumentFile,
				imageFile: file.ImageFile
			}))
		);

		return files;
	});
