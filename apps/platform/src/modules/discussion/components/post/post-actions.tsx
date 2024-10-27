'use client';

import { useRouter } from 'next/navigation';
import { type FC } from 'react';

import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import { usePostId } from '@/modules/discussion-panel/components/post-id-provider';
import { type FullPost } from '@/modules/post/types/full-post';
import { Reactions } from './reactions';

export const PostActions: FC<{ fullPost: FullPost }> = ({ fullPost }) => {
	const { post, votes } = fullPost;
	const { data: user } = api.account.getUser.useQuery();
	const { setPostId } = usePostId();
	const router = useRouter();
	const utils = api.useUtils();
	const { mutateAsync: deletePost } = api.post.deletePost.useMutation({
		onSuccess: async () => {
			// Invalidate and refetch relevant queries
			await utils.post.invalidate();
			await utils.post.getTopicPostsById.invalidate();
			await utils.post.listPostsByCollegeSlug.invalidate();

			// Force a re-render of the page
			router.refresh();
		}
	});

	const handleDeletePost = () => {
		deletePost({ postId: post.id });
	};

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
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
