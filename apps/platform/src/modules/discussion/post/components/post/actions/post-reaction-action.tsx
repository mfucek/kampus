import { type FC, type MouseEventHandler, useState } from 'react';

import { useAuth } from '@/deps/better-auth/use-auth';
import { api } from '@/deps/trpc/react';
import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { Skeleton } from '@/lib/shadcn/ui/skeleton';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/lib/shadcn/ui/tooltip';
import { cn } from '@/lib/shadcn/utils';
import { VoteType } from '@prisma/client';
import { type PostListByTopicIdItem } from '../../../api/procedures/list-by-topic-id';

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

export const PostReactionAction: FC<{
	reactions: PostListByTopicIdItem['reactions'];
	postId: string;
}> = ({ reactions, postId }) => {
	const { isSignedIn } = useAuth();

	const [optimisticVote, setOptimisticVote] = useState<
		VoteType | null | undefined
	>(undefined);

	const createVote = api.vote.createVote.useMutation();

	const likes = reactions.up;
	const dislikes = reactions.down;

	let reaction: VoteType | null = null;
	reaction =
		optimisticVote === null
			? null
			: (optimisticVote ?? reactions.sessionUserVote ?? null);

	let count = likes - dislikes;
	if (reactions.sessionUserVote === 'UP' && optimisticVote === null) {
		count -= 1;
	}
	if (reactions.sessionUserVote === 'UP' && optimisticVote === 'DOWN') {
		count -= 2;
	}
	if (reactions.sessionUserVote === 'DOWN' && optimisticVote === null) {
		count += 1;
	}
	if (reactions.sessionUserVote === 'DOWN' && optimisticVote === 'UP') {
		count += 2;
	}
	if (reactions.sessionUserVote === null && optimisticVote === 'UP') {
		count += 1;
	}
	if (reactions.sessionUserVote === null && optimisticVote === 'DOWN') {
		count -= 1;
	}

	const handleUpvote: MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.stopPropagation();

		if (!isSignedIn) {
			// openSignIn();
			return;
		}
		await createVote.mutateAsync({
			postId,
			type: reaction === VoteType.UP ? null : VoteType.UP
		});

		setOptimisticVote(VoteType.UP);
	};

	const handleDownvote: MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.stopPropagation();

		if (!isSignedIn) {
			// openSignIn();
			return;
		}
		await createVote.mutateAsync({
			postId,
			type: reaction === VoteType.DOWN ? null : VoteType.DOWN
		});

		setOptimisticVote(VoteType.DOWN);
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
								'button-sm text-neutral',
								!reaction &&
									(count < 0
										? 'text-danger!'
										: count > 0
											? 'text-success!'
											: 'text-neutral!')
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

export const PostReactionActionSkeleton = () => {
	return (
		<Skeleton
			className={cn(
				'flex flex-row gap-2 rounded-full items-center bg-neutral-weak'
			)}
		>
			<Button
				className="px-2 w-auto"
				size="xs"
				variant="ghost"
				iconOnly
				rounded
				disabled
			>
				<Icon icon="like" size={18} />
			</Button>

			<Button
				className="px-2 w-auto"
				size="xs"
				variant="ghost"
				iconOnly
				rounded
				disabled
			>
				<Icon icon="dislike" size={18} />
			</Button>
		</Skeleton>
	);
};
