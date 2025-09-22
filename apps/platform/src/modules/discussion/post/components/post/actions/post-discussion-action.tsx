import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { usePostId } from '@/modules/layout/components/post-id-provider';
import { FC } from 'react';
import { PostListByTopicIdItem } from '../../../api/procedures/list-by-topic-id';

export const PostDiscussionAction: FC<{ post: PostListByTopicIdItem }> = ({
	post
}) => {
	const { setPostId } = usePostId();

	const handleReply = () => {
		setPostId(post.post.id);
	};

	return (
		<Button
			theme="neutral"
			variant={'solid-weak'}
			size="xs"
			onClick={handleReply}
			rounded
		>
			<Icon icon="chat-single" />
			{post.repliesCount}
		</Button>
	);
};

export const PostDiscussionActionSkeleton = () => {
	return (
		<Button theme="neutral" variant={'solid-weak'} size="xs" rounded disabled>
			<Icon icon="chat-single" />
		</Button>
	);
};
