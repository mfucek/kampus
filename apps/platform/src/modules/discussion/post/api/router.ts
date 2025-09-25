import { createTRPCRouter } from '@/deps/trpc/trpc';

import { createPostProcedure } from './procedures/create-post';
import { deletePostProcedure } from './procedures/delete-post';
import { feedListProcedure } from './procedures/feed-list';
import { getPostByIdProcedure } from './procedures/get-by-id';
import { listByAuthorIdProcedure } from './procedures/list-by-author-id';
import { listByTopicIdProcedure } from './procedures/list-by-topic-id';
import { listRepliesProcedure } from './procedures/list-replies';

export const postRouter = createTRPCRouter({
	listByTopicId: listByTopicIdProcedure,
	feed: createTRPCRouter({
		list: feedListProcedure
	}),
	listByAuthorId: listByAuthorIdProcedure,
	listReplies: listRepliesProcedure,
	createPost: createPostProcedure,
	deletePost: deletePostProcedure,
	getPostById: getPostByIdProcedure
});
