import { publicProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const getDocumentProcedure = publicProcedure
	.input(z.object({ documentFileId: z.string() }))
	.query(async ({ input, ctx }) => {
		const { db } = ctx;
	});
