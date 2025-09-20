import { type Notification } from '@prisma/client';

import { protectedProcedure } from '@/deps/trpc/trpc';
import { getUserWithAvatarUrl } from '@/modules/user/helpers/get-user-with-avatar-url';

type NotificationReplyIndividual = {
	id: string;
	type: 'POST_REPLY';
	createdAt: Date;
	post: {
		id: string;
		contentShort: string;
	};
	aggregate: false;
	author: {
		name: string;
		avatarUrl: string;
	};
};

type NotificationReplyGrouped = {
	type: 'POST_REPLY';
	createdAt: Date;
	post: {
		id: string;
		contentShort: string;
	};
	aggregate: true;
	authors: {
		count: number;
		avatarUrls: string[];
	};
};

type NotificationVote = {
	id: string;
	type: 'POST_VOTE';
	createdAt: Date;
	post: {
		id: string;
		contentShort: string;
	};
} & (
	| {
			aggregate: false;
			author: {
				name: string;
				avatarUrl: string;
			};
	  }
	| {
			aggregate: true;
			authors: {
				count: number;
				avatarUrls: string[];
			};
	  }
);

export const listProcedure = protectedProcedure.query(async ({ ctx }) => {
	const { db, user } = ctx;

	const { id: userId } = user;

	const notificationsRaw = await db.notification.findMany({
		where: {
			recepientId: userId
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	const replyByPostId: Record<string, Notification[]> = {};

	for (const notification of notificationsRaw) {
		if (notification.type === 'POST_REPLY') {
			const postId = notification.postId!;
			if (Object.keys(replyByPostId).includes(postId)) {
				replyByPostId[postId] = [];
			} else {
				replyByPostId[postId] = [...replyByPostId[postId]!, notification];
			}
		}
	}

	const individualReplies: NotificationReplyIndividual[] = [];
	const groupedReplies: NotificationReplyGrouped[] = [];

	await Promise.all(
		Object.keys(replyByPostId).map(async (postId) => {
			const replyGroup = replyByPostId[postId]!;

			if (replyGroup.length === 1) {
				const reply = replyGroup[0]!;
				const individualReply: NotificationReplyIndividual = {
					id: reply.id,
					type: 'POST_REPLY',
					createdAt: reply.createdAt,
					post: {
						id: reply.postId!,
						contentShort: ''
					},
					aggregate: false,
					author: {
						name: '',
						avatarUrl: ''
					}
				};
				individualReplies.push(individualReply);
			} else {
				const firstReply = replyGroup[0]!;

				const authorsAvatarUrls = (
					await Promise.all(
						replyGroup
							.filter((reply, i) => {
								if (i > 2) {
									return false;
								}
								return true;
							})
							.map(async (reply) => {
								const user = await getUserWithAvatarUrl(reply.authorId!);
								return user?.avatarUrl;
							})
					)
				).filter((url) => url !== null) as string[];

				const replyGrouped: NotificationReplyGrouped = {
					type: 'POST_REPLY',
					createdAt: firstReply.createdAt,
					post: {
						id: firstReply.postId!,
						contentShort: ''
					},
					aggregate: true,
					authors: {
						count: replyGroup.length,
						avatarUrls: authorsAvatarUrls
					}
				};
				groupedReplies.push(replyGrouped);
			}
		})
	);

	const notifications: {
		POST_REPLY: {
			individual: NotificationReplyIndividual[];
			grouped: NotificationReplyGrouped[];
		};
	} = {
		POST_REPLY: {
			individual: individualReplies,
			grouped: groupedReplies
		}
	};

	return { notifications };
});
