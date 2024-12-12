import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

import { stripeRouter } from '@/lib/stripe/api/router';

import { accountRouter } from '@/modules/account/api/router';
import { fileRouter } from '@/modules/file/api/router';
import { notificationsRouter } from '@/modules/notifications/api/router';
import { postRouter } from '@/modules/post/api/router';
import { collegeRouter } from '@/modules/topic/college/api/router';
import { programRouter } from '@/modules/topic/program/api/router';
import { staffRouter } from '@/modules/topic/staff/api/router';
import { subjectRouter } from '@/modules/topic/subject/api/router';
import { userRouter } from '@/modules/user/api/router';
import { voteRouter } from '@/modules/vote/api/router';

export const appRouter = createTRPCRouter({
	post: postRouter,
	college: collegeRouter,
	stripe: stripeRouter,
	account: accountRouter,
	subject: subjectRouter,
	program: programRouter,
	staff: staffRouter,
	vote: voteRouter,
	file: fileRouter,
	user: userRouter,
	notifications: notificationsRouter
});

export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
