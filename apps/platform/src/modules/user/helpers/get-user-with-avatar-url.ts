import { db } from '@/deps/prisma';
import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';

export const getUserWithAvatarUrl = async (userId: string) => {
	const userRaw = await db.user.findFirst({
		where: {
			id: userId
		},
		include: {
			ImageFile: {
				include: {
					File: true
				}
			}
		}
	});

	if (!userRaw) {
		return null;
	}

	const avatarKey = userRaw.ImageFile?.File?.key;
	const avatarUrl = avatarKey ? await getFileDownloadUrl(avatarKey) : null;

	const user = {
		id: userRaw.id,
		displayName: userRaw.name,
		imageUrl: userRaw.ImageFile?.File?.key
			? await getFileDownloadUrl(userRaw.ImageFile?.File?.key)
			: null,
		badge: userRaw.badge,
		createdAt: userRaw.createdAt,
		updatedAt: userRaw.updatedAt
	};

	return { user, avatarUrl };
};
