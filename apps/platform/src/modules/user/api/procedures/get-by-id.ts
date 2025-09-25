import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { publicProcedure } from '@/deps/trpc/trpc';
import { z } from 'zod';

export const getUserByIdProcedure = publicProcedure
	.input(z.object({ userId: z.string() }))
	.query(async ({ ctx, input }) => {
		const userRaw = await ctx.db.user.findUnique({
			where: {
				id: input.userId
			},
			include: {
				ImageFile: {
					include: {
						File: true
					}
				}
			}
		});

		const user = {
			id: userRaw?.id,
			name: userRaw?.name,
			badge: userRaw?.badge,
			createdAt: userRaw?.createdAt,
			updatedAt: userRaw?.updatedAt,
			imageUrl: userRaw?.ImageFile?.File?.key
				? await getFileDownloadUrl(userRaw.ImageFile.File.key)
				: null
		};

		return { user };
	});
