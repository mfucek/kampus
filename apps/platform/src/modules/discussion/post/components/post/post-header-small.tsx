import { Icon } from '@/global/components/icon';
import { Badge } from '@/lib/shadcn/ui/badge';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/lib/shadcn/ui/popover';
import { Skeleton } from '@/lib/shadcn/ui/skeleton';
import Image from 'next/image';
import { FC } from 'react';
import { PostListByTopicIdItem } from '../../api/procedures/list-by-topic-id';
import { PostActionsList } from './actions/post-actions-list';

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

			<Popover>
				<PopoverTrigger asChild>
					<Button theme="neutral" variant="ghost" size="sm" iconOnly>
						<Icon icon="ellipsis" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="flex flex-col gap-0 p-0 py-2" align="end">
					<PostActionsList post={post} />
				</PopoverContent>
			</Popover>
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
