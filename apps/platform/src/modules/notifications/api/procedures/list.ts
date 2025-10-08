import { type JSONContent } from '@tiptap/react';

import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { extractText } from '@/deps/tiptap/extract-text';
import { protectedProcedure } from '@/deps/trpc/trpc';

export const listProcedure = protectedProcedure.query(async ({ ctx }) => {
	const { db, user } = ctx;

	const notificationsRaw = await db.notification.findMany({
		where: {
			recepientId: user.id
		}
	});

	// Replies
	const postIds = notificationsRaw
		.map((notificationRaw) => notificationRaw.postId)
		.filter((postId) => postId !== null);

	const postsRaw = await db.post.findMany({
		where: {
			id: {
				in: postIds
			}
		},
		include: {
			Author: {
				select: {
					name: true,
					badge: true,
					ImageFile: {
						select: {
							File: {
								select: {
									key: true
								}
							}
						}
					}
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	const notifications = await Promise.all(
		notificationsRaw.map(async (notificationRaw) => {
			const notification = {
				id: notificationRaw.id,
				createdAt: notificationRaw.createdAt,
				type: notificationRaw.type,
				seen: notificationRaw.seen,
				postId: notificationRaw.postId
			};

			const replyPostRaw = postsRaw.find(
				(postRaw) => postRaw.id === notificationRaw.postId
			);

			const reply = replyPostRaw
				? {
						originalPostLink: replyPostRaw.replyToId
							? `/post/${replyPostRaw.replyToId}`
							: null,
						post: {
							id: replyPostRaw.id,
							body:
								extractText(replyPostRaw.body as JSONContent | null) ??
								'[ Ova objava je obrisana ]',
							link: `/post/${replyPostRaw.id}`
						},
						author: {
							id: replyPostRaw.authorId,
							name: replyPostRaw.Author.name,
							imageUrl: replyPostRaw.Author.ImageFile?.File.key
								? await getFileDownloadUrl(
										replyPostRaw.Author.ImageFile.File.key
									)
								: null,
							badge: replyPostRaw.Author.badge
						}
					}
				: null;

			return { notification, reply };
		})
	);

	return notifications;
});

export type NotificationListItem = Awaited<
	ReturnType<typeof listProcedure>
>[number];
