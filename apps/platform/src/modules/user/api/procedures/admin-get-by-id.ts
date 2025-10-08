import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { getFileDownloadUrl } from '@/deps/s3/get-file-download-url';
import { publicProcedure } from '@/deps/trpc/trpc';
import { type ListUsersItem } from './list';

export const adminGetUserByIdProcedure = publicProcedure
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

		if (!userRaw) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'User not found'
			});
		}

		const user = {
			...({
				id: userRaw.id,
				name: userRaw.name,
				badge: userRaw.badge,
				createdAt: userRaw.createdAt,
				updatedAt: userRaw.updatedAt,
				email: userRaw.email,
				emailVerified: userRaw.emailVerified,
				image: userRaw.image,
				role: userRaw.role
			} satisfies ListUsersItem),
			imageUrl: userRaw.ImageFile?.File?.key
				? await getFileDownloadUrl(userRaw.ImageFile.File.key)
				: null
		};

		return { user };
	});
