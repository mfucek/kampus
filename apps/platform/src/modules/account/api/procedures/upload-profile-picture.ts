import { z } from 'zod';

import { deleteFile } from '@/lib/s3/delete-file';
import { protectedProcedure } from '@/lib/trpc/trpc';

export const uploadProfilePictureProcedure = protectedProcedure
	.input(z.object({ key: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const { db, user } = ctx;

		const oldProfileIcon = await db.imageFile.findFirst({
			where: {
				userId: user.id
			},
			include: {
				File: true
			}
		});

		// Delete old profile picture file
		if (oldProfileIcon) {
			await deleteFile(oldProfileIcon.File.key);
			await db.imageFile.delete({
				where: { userId: user.id },
				include: {
					File: true
				}
			});
			await db.file.delete({
				where: { id: oldProfileIcon.File.id }
			});
		}

		// Create new profile picture file
		await db.file.create({
			data: {
				key: input.key,
				authorId: user.id,
				ImageFile: {
					create: {
						userId: user.id
					}
				}
			}
		});

		return { success: true };
	});
