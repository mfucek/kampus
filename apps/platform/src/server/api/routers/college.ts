import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const collegeRouter = createTRPCRouter({
	listAll: publicProcedure.query(async ({ ctx }) => {
		const { db } = ctx;

		const colleges = await db.college.findMany({
			orderBy: {
				Post: {
					_count: 'desc'
				}
			}
		});
		return colleges;
	}),

	getBySlug: publicProcedure
		.input(z.object({ collegeSlug: z.string() }))
		.query(async ({ input, ctx }) => {
			const { db } = ctx;

			const college = await db.college.findUnique({
				where: {
					slug: input.collegeSlug
				}
			});

			if (!college) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'College not found'
				});
			}

			return college;
		})
});
