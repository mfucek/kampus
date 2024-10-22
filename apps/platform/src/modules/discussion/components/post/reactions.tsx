'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/lib/shadcn/ui/tooltip';
import { cn } from '@/lib/shadcn/utils';
import { api } from '@/lib/trpc/react';
import { useAuth, useClerk } from '@clerk/nextjs';
import { VoteType } from '@prisma/client';
import { type FC } from 'react';

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
	const { openSignIn } = useClerk();

	const userVoteAfterCheck = api.vote.getVotesByPostIdWithUser.useMutation();
	const createVote = api.vote.createVote.useMutation({
		onSuccess: () => {
			userVoteAfterCheck.mutateAsync({ postId });
		}
	});

	const likes = userVoteAfterCheck.data?.likes ?? votes.likes;
	const dislikes = userVoteAfterCheck.data?.dislikes ?? votes.dislikes;

	let reaction: VoteType | null = null;
	if (userVoteAfterCheck.data) {
		reaction = userVoteAfterCheck.data.userVote?.type ?? null;
	} else {
		reaction = votes.userVote ?? null;
	}

	const count = likes - dislikes;

	const handleUpvote = () => {
		if (!isSignedIn) {
			openSignIn();
			return;
		}
		if (reaction === VoteType.UP) {
			createVote.mutateAsync({ postId, type: null });
			return;
		}
		createVote.mutateAsync({ postId, type: VoteType.UP });
	};

	const handleDownvote = () => {
		if (!isSignedIn) {
			openSignIn();
			return;
		}
		if (reaction === VoteType.DOWN) {
			createVote.mutateAsync({ postId, type: null });
			return;
		}
		createVote.mutateAsync({ postId, type: VoteType.DOWN });
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
