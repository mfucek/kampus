import { z } from 'zod';

import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { publicProcedure } from '@/deps/trpc/trpc';

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

		const url = await getFileDownloadUrl(profilePicture.File.key);

		return url;
	});
