import { z } from 'zod';

import { getFileUrl } from '@/lib/s3';
import { publicProcedure } from '@/server/api/trpc';

export const getUserProfilePictureUrlProcedure = publicProcedure
	.input(z.object({ userId: z.string() }))
	.query(async ({ ctx, input }) => {
		const { db } = ctx;

		const profilePicture = await db.imageFile.findFirst({
			where: {
				userId: input.userId
			},
			include: {
				File: true
			}
		});

		if (!profilePicture) return null;

		const url = await getFileUrl(profilePicture.File.key);

		return url;
	});
