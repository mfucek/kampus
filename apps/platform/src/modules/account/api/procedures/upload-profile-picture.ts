import { z } from 'zod';

import { deleteFile } from '@/lib/s3';
import { protectedProcedure } from '@/server/api/trpc';

export const uploadProfilePictureProcedure = protectedProcedure
	.input(z.object({ key: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const { db, user } = ctx;

		const oldProfileIcon = await db.imageFile.findFirst({
			where: {
				userId: user.id
			},
			include: {
				file: true
			}
		});

		// Delete old profile picture file
		if (oldProfileIcon) {
			console.log('deleting old profile picture file');
			await deleteFile(oldProfileIcon.file.key);
			await db.imageFile.delete({
				where: { userId: user.id },
				include: {
					file: true
				}
			});
			await db.file.delete({
				where: { id: oldProfileIcon.file.id }
			});
		}

		// Create new profile picture file
		const file = await db.file.create({
			data: {
				key: input.key,
				type: 'IMAGE',
				authorId: user.id!
			}
		});

		// Create new profile picture file
		await db.imageFile.create({
			data: {
				userId: user.id,
				fileId: file.id
			}
		});

		return { success: true };
	});
