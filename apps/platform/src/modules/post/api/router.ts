import { createTRPCRouter } from '@/server/api/trpc';

import { createPostProcedure } from './procedures/create-post';
import { deletePostProcedure } from './procedures/delete-post';
import { getPostByIdProcedure } from './procedures/get-by-id';
import { getThreadProcedure } from './procedures/get-thread';
import { getTopicPostsByIdProcedure } from './procedures/get-topic-posts-by-id';
import { listProcedure } from './procedures/list';
import { listPostsByCollegeSlugProcedure } from './procedures/list-by-college-slug';

export const postRouter = createTRPCRouter({
	list: listProcedure,
	listPostsByCollegeSlug: listPostsByCollegeSlugProcedure,
	getTopicPostsById: getTopicPostsByIdProcedure,
	createPost: createPostProcedure,
	deletePost: deletePostProcedure,
	getPostById: getPostByIdProcedure,
	getThread: getThreadProcedure
});
