import { createTRPCRouter } from '@/deps/trpc/trpc';

import { createPostProcedure } from './procedures/create-post';
import { deletePostProcedure } from './procedures/delete-post';
import { getPostByIdProcedure } from './procedures/get-by-id';
import { listByTopicIdProcedure } from './procedures/list-by-topic-id';
import { listRepliesProcedure } from './procedures/list-replies';

export const postRouter = createTRPCRouter({
	listByTopicId: listByTopicIdProcedure,
	listReplies: listRepliesProcedure,
	createPost: createPostProcedure,
	deletePost: deletePostProcedure,
	getPostById: getPostByIdProcedure
});
