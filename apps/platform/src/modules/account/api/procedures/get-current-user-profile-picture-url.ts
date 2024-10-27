import { getFileUrl } from '@/lib/s3';
import { protectedProcedure } from '@/server/api/trpc';

export const getCurrentUserProfilePictureUrlProcedure =
	protectedProcedure.query(async ({ ctx }) => {
		const { db, user } = ctx;

		const profilePicture = await db.imageFile.findFirst({
			where: {
				userId: user.id
			},
			include: {
				file: true
			}
		});

		if (!profilePicture) return null;

		const url = await getFileUrl(profilePicture.file.key);

		return url;
	});
