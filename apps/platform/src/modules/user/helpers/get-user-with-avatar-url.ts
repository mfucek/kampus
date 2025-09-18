import { db } from '@/lib/db';
import { getFileDownloadUrl } from '@/lib/s3/get-file-download-url';

export const getUserWithAvatarUrl = async (userId: string) => {
	const userRaw = await db.user.findFirst({
		where: {
			id: userId
		},
		include: {
			image: {
				include: {
					File: true
				}
			}
		}
	});

	if (!userRaw) {
		return null;
	}

	const avatarKey = userRaw.image?.File?.key;
	const avatarUrl = avatarKey ? await getFileDownloadUrl(avatarKey) : null;

	const user = {
		id: userRaw.id,
		displayName: userRaw.displayName,
		imageUrl: userRaw.image?.File.key
			? await getFileDownloadUrl(userRaw.image?.File.key)
			: null,
		badge: userRaw.badge,
		createdAt: userRaw.createdAt,
		updatedAt: userRaw.updatedAt,
		accountId: userRaw.accountId
	};

	return { user, avatarUrl };
};
