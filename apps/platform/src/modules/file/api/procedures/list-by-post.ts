import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';

export const listByPostProcedure = publicProcedure
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

		return files;
	});
