'use client';

import { useRouter } from 'next/navigation';
import { type FC } from 'react';

import { Button } from '@/lib/shadcn/ui/button';
import { useToast } from '@/lib/shadcn/ui/use-toast';
import { api } from '@/lib/trpc/react';
import { usePostId } from '@/modules/discussion-panel/components/post-id-provider';
import { type VoteType } from '@prisma/client';
import { Reactions } from './reactions';

type PostActionsInterface = {
	post: {
		id: string;
		_count: {
			replies: number;
		};
		author: {
			id: string;
		};
	};
	votes: {
		likes: number;
		dislikes: number;
		userVote: VoteType | null;
	};
};

export const PostActions: FC<{ fullPost: PostActionsInterface }> = ({
	fullPost
}) => {
	const { post, votes } = fullPost;

	const router = useRouter();
	const utils = api.useUtils();
	const { toast } = useToast();
	const { data: user } = api.account.getUser.useQuery();
	const { setPostId } = usePostId();
	const { mutateAsync: deletePost } = api.post.deletePost.useMutation({
		onSuccess: async () => {
			// Invalidate and refetch relevant queries
			await utils.post.invalidate();

			// Force a re-render of the page
			router.refresh();
		}
	});

	const handleDeletePost = () => {
		deletePost({ postId: post.id });
	};

	const handleShare = () => {
		const sharedUrl = window.location.origin + '/post/' + post.id;

		// navigator.clipboard.writeText(window.location.href);
		if (navigator.canShare()) {
			navigator.share({
				title: 'Share this post',
				url: sharedUrl
			});
		} else {
			navigator.clipboard.writeText(sharedUrl);
			toast({
				title: 'Copied to clipboard',
				description: 'You can now paste the link anywhere you want',
				variant: 'success'
			});
		}
	};

	const handleReply = () => {
		setPostId(post.id);
	};

	const numberOfReplies = post._count.replies;

	return (
		<div className="flex flex-row gap-2" suppressHydrationWarning>
			<Reactions votes={votes} postId={post.id} />
			<Button theme="neutral" variant="ghost" size="xs" onClick={handleReply}>
				{numberOfReplies ? `${numberOfReplies} replies` : 'Reply'}
			</Button>
			<Button theme="neutral" variant="ghost" size="xs" onClick={handleShare}>
				Share
			</Button>
			{user?.id === post.author.id && (
				<Button
					theme="neutral"
					variant="ghost"
					size="xs"
					onClick={handleDeletePost}
				>
					Delete
				</Button>
			)}
		</div>
	);
};
