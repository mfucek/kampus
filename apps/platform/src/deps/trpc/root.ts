import { createCallerFactory, createTRPCRouter } from '@/deps/trpc/trpc';

import { postRouter } from '@/modules/discussion/post/api/router';
import { voteRouter } from '@/modules/discussion/vote/api/router';
import { fileRouter } from '@/modules/file/api/router';
import { topicRouter } from '@/modules/topic/api/router';
import { userRouter } from '@/modules/user/api/router';

export const appRouter = createTRPCRouter({
	post: postRouter,
	user: userRouter,
	topic: topicRouter,
	vote: voteRouter,
	file: fileRouter
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
