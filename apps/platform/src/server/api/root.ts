import { fileRouter } from '@/modules/file/api/router';
import { postRouter } from '@/server/api/routers/post/router';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { accountRouter } from './routers/account';
import { collegeRouter } from './routers/college';
import { staffRouter } from './routers/staff';
import { stripeRouter } from './routers/stripe';
import { subjectRouter } from './routers/subject';
import { voteRouter } from './routers/vote';
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
	vote: voteRouter,
	file: fileRouter
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
