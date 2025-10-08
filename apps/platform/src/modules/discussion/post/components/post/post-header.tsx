import Image from 'next/image';
import { type FC } from 'react';

import { Badge } from '@/lib/shadcn/ui/badge';
import { formatRelativeDate } from '@/utils/format-relative-date';
import { type PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';
import { PostActionsListTrigger } from './actions/post-actions-list-trigger';

export const PostHeader: FC<{
	post: PostListByTopicIdItem;
}> = ({ post }) => {
	return (
		<div className="flex flex-row gap-2 items-center justify-between">
			<div className="flex flex-row gap-2 items-center">
				<div className="w-8 h-8 rounded-full bg-neutral-weak relative overflow-hidden">
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
