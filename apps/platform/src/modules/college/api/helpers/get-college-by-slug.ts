import type { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export const getCollegeBySlug = async (db: PrismaClient, slug: string) => {
	const college = await db.college.findUnique({
		where: { slug }
	});

	if (!college) {
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'College not found'
		});
	}

	return college;
};
