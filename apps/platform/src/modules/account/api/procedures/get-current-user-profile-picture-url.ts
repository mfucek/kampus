import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { protectedProcedure } from '@/deps/trpc/trpc';

export const getCurrentUserProfilePictureUrlProcedure =
	protectedProcedure.query(async ({ ctx }) => {
		const { db, user } = ctx;

		const profilePicture = await db.imageFile.findFirst({
			where: {
				userId: user.id
			},
			include: {
				File: true
			}
		});

		if (!profilePicture) return null;

		const url = await getFileDownloadUrl(profilePicture.File.key);

		return url;
	});
