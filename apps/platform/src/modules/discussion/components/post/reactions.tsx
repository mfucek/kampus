'use client';

import { useAuth } from '@/deps/better-auth/use-auth';
import { api } from '@/deps/trpc/react';
import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/lib/shadcn/ui/tooltip';
import { cn } from '@/lib/shadcn/utils';
import { VoteType } from '@prisma/client';
import { useState, type FC } from 'react';

const reactionToTheme = (reaction: VoteType | null) => {
	switch (reaction) {
		case VoteType.UP:
			return 'success';
		case VoteType.DOWN:
			return 'danger';
		default:
			return 'neutral';
	}
};

export const Reactions: FC<{
	votes: {
		likes: number;
		dislikes: number;
		userVote: VoteType | null;
	};
	postId: string;
}> = ({ votes, postId }) => {
	const { isSignedIn } = useAuth();

	// const userVoteAfterCheck = api.vote.getVotesByPostIdWithUser.useMutation();
	const [optimisticVote, setOptimisticVote] = useState<
		VoteType | null | undefined
	>(undefined);

	const createVote = api.vote.createVote.useMutation({
		onMutate: ({ type }) => {
			// optimistic updating
			setOptimisticVote(type);
		},
		onSuccess: () => {
			// userVoteAfterCheck.mutateAsync({ postId });
			// setOptimisticVote(undefined);
		}
	});

	const likes = votes.likes;

	const dislikes = votes.dislikes;

	let reaction: VoteType | null = null;
	reaction =
		optimisticVote === null ? null : (optimisticVote ?? votes.userVote ?? null);

	let count = likes - dislikes;
	if (votes.userVote === 'UP' && optimisticVote === null) {
		count -= 1;
	}
	if (votes.userVote === 'UP' && optimisticVote === 'DOWN') {
		count -= 2;
	}
	if (votes.userVote === 'DOWN' && optimisticVote === null) {
		count += 1;
	}
	if (votes.userVote === 'DOWN' && optimisticVote === 'UP') {
		count += 2;
	}
	if (votes.userVote === null && optimisticVote === 'UP') {
		count += 1;
	}
	if (votes.userVote === null && optimisticVote === 'DOWN') {
		count -= 1;
	}

	const handleUpvote = async () => {
		if (!isSignedIn) {
			// openSignIn();
			return;
		}
		await createVote.mutateAsync({
			postId,
			type: reaction === VoteType.UP ? null : VoteType.UP
		});
	};

	const handleDownvote = async () => {
		if (!isSignedIn) {
			// openSignIn();
			return;
		}
		await createVote.mutateAsync({
			postId,
			type: reaction === VoteType.DOWN ? null : VoteType.DOWN
		});
	};

	return (
		<div
			className={cn(
				'flex flex-row gap-2 rounded-full items-center bg-neutral-weak',
				reaction == VoteType.UP && 'bg-success-medium',
				reaction == VoteType.DOWN && 'bg-danger-medium'
			)}
		>
			<Button
				theme={reactionToTheme(reaction)}
				variant={
					reaction == VoteType.UP ? 'solid' : !reaction ? 'ghost' : 'ghost-weak'
				}
				className="px-2 w-auto"
				size="xs"
				iconOnly
				rounded
				onClick={handleUpvote}
			>
				<Icon icon="like" size={18} />
			</Button>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<span
							className={cn(
								'button-sm',
								!reaction &&
									(count < 0
										? 'text-danger'
										: count > 0
											? 'text-success'
											: 'text-neutral')
							)}
						>
							{count}
						</span>
					</TooltipTrigger>
					<TooltipContent side="top">
						<span className="body-2">
							{likes} / {dislikes}
						</span>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<Button
				theme={reactionToTheme(reaction)}
				variant={
					reaction == VoteType.DOWN
						? 'solid'
						: !reaction
							? 'ghost'
							: 'ghost-weak'
				}
				className="px-2 w-auto"
				size="xs"
				iconOnly
				rounded
				onClick={handleDownvote}
			>
				<Icon icon="dislike" size={18} />
			</Button>
		</div>
	);
};
