import { createTRPCRouter } from '@/deps/trpc/trpc';

import { createFollowProcedure } from './procedures/create';
import { deactivateFollowProcedure } from './procedures/deactivate';
import { getByTopicIdProcedure } from './procedures/get-by-topic-id';
import { listFollowedTopicsProcedure } from './procedures/list-followed-topics';

export const followRouter = createTRPCRouter({
	getByTopicId: getByTopicIdProcedure,
	create: createFollowProcedure,
	deactivate: deactivateFollowProcedure,
	listFollowedTopics: listFollowedTopicsProcedure
});
