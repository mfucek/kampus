import { createTRPCRouter } from '@/lib/trpc/trpc';
import { createVoteProcedure } from './procedures/create-vote';
import { getVotesByPostIdProcedure } from './procedures/get-votes-by-post-id';
import { getVotesByPostIdWithUserProcedure } from './procedures/get-votes-by-post-id-with-user';

export const voteRouter = createTRPCRouter({
	getVotesByPostId: getVotesByPostIdProcedure,
	getVotesByPostIdWithUser: getVotesByPostIdWithUserProcedure,
	createVote: createVoteProcedure
});
