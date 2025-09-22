import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/lib/shadcn/ui/popover';
import { type PostListByTopicIdItem } from '../../../api/procedures/list-by-topic-id';
import { PostActionsList } from './post-actions-list';

export const PostActionsListTrigger = ({
	post
}: {
	post: PostListByTopicIdItem;
}) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					theme="neutral"
					variant="ghost"
					size="sm"
					iconOnly
					onClick={(e) => e.stopPropagation()}
				>
					<Icon icon="ellipsis" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="flex flex-col gap-0 p-0 py-2" align="end">
				<PostActionsList post={post} />
			</PopoverContent>
		</Popover>
	);
};
