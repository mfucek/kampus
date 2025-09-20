import { createCallerFactory, createTRPCRouter } from '@/deps/trpc/trpc';

// import { stripeRouter } from '@/deps/stripe/api/router';

import { postRouter } from '@/modules/discussion/post/api/router';
import { voteRouter } from '@/modules/discussion/vote/api/router';
import { fileRouter } from '@/modules/file/api/router';
import { notificationsRouter } from '@/modules/notifications/api/router';
import { collegeRouter } from '@/modules/topic/college/api/router';
import { programRouter } from '@/modules/topic/program/api/router';
import { staffRouter } from '@/modules/topic/staff/api/router';
import { subjectRouter } from '@/modules/topic/subject/api/router';
import { userRouter } from '@/modules/user/api/router';

export const appRouter = createTRPCRouter({
	post: postRouter,
	college: collegeRouter,
	user: userRouter,
	subject: subjectRouter,
	program: programRouter,
	staff: staffRouter,
	vote: voteRouter,
	file: fileRouter,
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
