import { type PrismaClient, VoteType } from '@prisma/client';

export const getPostVotes = async (
	postId: string,
	userId: string | null | undefined,
	db: PrismaClient
) => {
	const votes = await db.vote.findMany({
		where: {
			postId: postId
		}
	});

	const likes = votes.filter((vote) => vote.type === VoteType.UP).length;
	const dislikes = votes.filter((vote) => vote.type === VoteType.DOWN).length;

	const userVote = votes.find((vote) => vote.userId === userId)?.type ?? null;

	return {
		likes,
		dislikes,
		userVote
	};
};
