import { db } from '@/lib/prisma/db';
import { getFileUrl } from '@/lib/s3';

export const getUserWithAvatarUrl = async (userId: string) => {
	const user = await db.user.findFirst({
		where: {
			id: userId
		},
		include: {
			image: {
				include: {
					file: true
				}
			}
		}
	});

	if (!user) {
		return null;
	}

	const avatarKey = user.image?.file.key;
	const avatarUrl = avatarKey ? await getFileUrl(avatarKey) : null;

	return { user, avatarUrl };
};
