import { db } from '@/lib/db';
import { getFileUrl } from '@/lib/s3';

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
	const avatarUrl = avatarKey ? await getFileUrl(avatarKey) : null;

	const user = {
		id: userRaw.id,
		displayName: userRaw.displayName,
		imageUrl: userRaw.image?.File.key
			? await getFileUrl(userRaw.image?.File.key)
			: null,
		badge: userRaw.badge,
		createdAt: userRaw.createdAt,
		updatedAt: userRaw.updatedAt,
		accountId: userRaw.accountId
	};

	return { user, avatarUrl };
};
