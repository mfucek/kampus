import { createCallerFactory, createTRPCRouter } from '@/deps/trpc/trpc';

// import { stripeRouter } from '@/deps/stripe/api/router';

import { postRouter } from '@/modules/discussion/post/api/router';
import { voteRouter } from '@/modules/discussion/vote/api/router';
import { fileRouter } from '@/modules/file/api/router';
import { notificationsRouter } from '@/modules/notifications/api/router';
import { topicRouter } from '@/modules/topic/api/router';
import { userRouter } from '@/modules/user/api/router';

export const appRouter = createTRPCRouter({
	post: postRouter,
	user: userRouter,
	topic: topicRouter,
	vote: voteRouter,
	file: fileRouter,
	notifications: notificationsRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
