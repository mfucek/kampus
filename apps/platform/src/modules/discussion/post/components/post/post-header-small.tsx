import { type FC } from 'react';

import { Icon } from '@/global/components/icon';
import { Badge } from '@/lib/shadcn/ui/badge';
import { Button } from '@/lib/shadcn/ui/button';
import { Skeleton } from '@/lib/shadcn/ui/skeleton';
import { formatRelativeDate } from '@/utils/format-relative-date';
import Image from 'next/image';
import { type PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';
import { PostActionsListTrigger } from './actions/post-actions-list-trigger';

export const PostHeaderSmall: FC<{
	post: PostListByTopicIdItem;
}> = ({ post }) => {
	return (
		<div className="flex flex-row gap-2 items-center justify-between">
			<div className="flex flex-row gap-2 items-center">
				<div className="w-6 h-6 rounded-full bg-neutral-weak relative overflow-hidden">
					{post.author.imageUrl && (
						<Image src={post.author.imageUrl} alt={post.author.name} fill />
					)}
				</div>

				<span className="caption text-neutral">{post.author.name}</span>

				{post.author.badge && (
					<Badge variant="secondary" theme="info" size="sm">
						{post.author.badge}
					</Badge>
				)}
			</div>

			<div className="flex flex-row gap-2 items-center">
				<span className="caption text-neutral-medium">
					{formatRelativeDate(post.post.createdAt)}
				</span>

				<PostActionsListTrigger post={post} />
			</div>
		</div>
	);
};

export const PostHeaderSmallSkeleton = () => {
	return (
		<div className="flex flex-row gap-2 items-center justify-between">
			<div className="flex flex-row gap-2 items-center">
				<Skeleton className="w-6 h-6 rounded-full" />
				<Skeleton className="w-20 h-4 rounded-full" />
			</div>

			<Button theme="neutral" variant="ghost" size="sm" iconOnly disabled>
				<Icon icon="ellipsis" />
			</Button>
		</div>
	);
};
