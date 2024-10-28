import type { PrismaClient } from '@prisma/client';

export const getUserId = async (
	clerkUserId: string | null | undefined,
	db: PrismaClient
) => {
	let userId = null;
	if (clerkUserId) {
		const account = await db.account.findUnique({
			where: {
				clerkUserId: clerkUserId
			},
			include: {
				user: true
			}
		});

		userId = account?.user?.id;
	}

	return userId;
};
