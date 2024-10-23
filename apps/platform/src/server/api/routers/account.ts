import { deleteFile, getFileUrl, getS3UploadPresignedUrl } from '@/lib/s3';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const accountRouter = createTRPCRouter({
	getAccount: protectedProcedure.query(async ({ ctx }) => {
		const { db, auth } = ctx;

		const account = await db.account.findFirst({
			where: {
				clerkUserId: auth.userId!
			}
		});

		return account;
	}),

	getUser: protectedProcedure.query(async ({ ctx }) => {
		const { user } = ctx;

		return user;
	}),

	updateDisplayName: protectedProcedure
		.input(
			z.object({
				displayName: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { db, user } = ctx;

			await db.user.update({
				where: {
					id: user.id!
				},
				data: {
					displayName: input.displayName
				}
			});

			return;
		}),

	updateBadge: protectedProcedure
		.input(z.object({ badge: z.string().nullable() }))
		.mutation(async ({ ctx, input }) => {
			const { db, user } = ctx;

			await db.user.updateMany({
				where: {
					id: user.id!
				},
				data: {
					badge: input.badge || null
				}
			});

			return { success: true };
		}),

	uploadProfilePicture: protectedProcedure
		.input(z.object({ key: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { db, user } = ctx;

			const oldProfileIcon = await db.profileIcon.findFirst({
				where: {
					userId: user.id
				},
				include: {
					file: true
				}
			});

			if (oldProfileIcon) {
				console.log('deleting old profile picture file');
				await deleteFile(oldProfileIcon.file.key);
				await db.profileIcon.delete({
					where: { userId: user.id },
					include: {
						file: true
					}
				});
				await db.file.delete({
					where: { id: oldProfileIcon.file.id }
				});
			}

			console.log('creating new profile picture file');
			const file = await db.file.create({
				data: {
					key: input.key,
					type: 'IMAGE',
					authorId: user.id!
				}
			});
			console.log('created file', file.id);

			console.log('creating new profile icon');
			await db.profileIcon.create({
				data: {
					userId: user.id,
					fileId: file.id
				}
			});

			return { success: true };
		}),

	getUploadUrl: protectedProcedure.mutation(async ({ ctx, input }) => {
		const key = nanoid();

		const url = await getS3UploadPresignedUrl(key);

		return { url, key };
	}),

	getCurrentUserProfilePictureUrl: protectedProcedure.query(async ({ ctx }) => {
		const { db, user } = ctx;

		const profilePicture = await db.file.findFirst({
			where: {
				ProfileIcon: {
					some: {
						userId: user.id!
					}
				}
			}
		});

		if (!profilePicture) return null;

		const url = await getFileUrl(profilePicture.key);

		return url;
	}),

	getUserProfilePictureUrl: publicProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ ctx, input }) => {
			const { db } = ctx;

			const profilePicture = await db.file.findFirst({
				where: {
					ProfileIcon: {
						some: { userId: input.userId }
					}
				}
			});

			if (!profilePicture) return null;

			const url = await getFileUrl(profilePicture.key);

			return url;
		})
});
