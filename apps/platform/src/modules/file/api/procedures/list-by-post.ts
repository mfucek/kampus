import { publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

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

		const imageFiles = files
			.filter((file) => file.imageFile !== null)
			.map((file) => {});

		return files;
	});
