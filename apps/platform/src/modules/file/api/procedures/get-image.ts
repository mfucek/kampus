import { publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const getImageProcedure = publicProcedure
	.input(z.object({ imageFileId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;
	});
