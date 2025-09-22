import { createTRPCRouter } from '@/deps/trpc/trpc';

import { createPostProcedure } from './procedures/create-post';
import { deletePostProcedure } from './procedures/delete-post';
import { getPostByIdProcedure } from './procedures/get-by-id';
import { getThreadProcedure } from './procedures/get-thread';
import { listProcedure } from './procedures/list';
import { listByTopicIdProcedure } from './procedures/list-by-topic-id';

export const postRouter = createTRPCRouter({
	list: listProcedure,
	listByTopicId: listByTopicIdProcedure,
	createPost: createPostProcedure,
	deletePost: deletePostProcedure,
	getPostById: getPostByIdProcedure,
	getThread: getThreadProcedure
});
