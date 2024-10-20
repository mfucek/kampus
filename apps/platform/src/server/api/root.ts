import { postRouter } from '@/server/api/routers/post';
import {
	createCallerFactory,
	createTRPCRouter,
	protectedProcedure
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { accountRouter } from './routers/account';
import { collegeRouter } from './routers/college';
import { staffRouter } from './routers/staff';
import { stripeRouter } from './routers/stripe';
import { subjectRouter } from './routers/subject';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	post: postRouter,
	college: collegeRouter,
	stripe: stripeRouter,
	account: accountRouter,
	subject: subjectRouter,
	staff: staffRouter,
	me: protectedProcedure.query(async ({ ctx }) => {
		const { db, auth } = ctx;
		const userId = auth.userId;

		if (!userId) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'User not found'
			});
		}

		const account = await db.account.findFirst({
			where: {
				clerkUserId: ctx.auth.userId!
			}
		});
		return { clerkUserId: ctx.auth.userId, account };
	})
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
