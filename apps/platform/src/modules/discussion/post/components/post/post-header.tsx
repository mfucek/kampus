import { Icon } from '@/global/components/icon';
import { Badge } from '@/lib/shadcn/ui/badge';
import { Button } from '@/lib/shadcn/ui/button';
import Image from 'next/image';
import { FC } from 'react';
import { PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';

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

			<Button theme="neutral" variant="ghost" size="sm" iconOnly>
				<Icon icon="ellipsis" />
			</Button>
		</div>
	);
};
