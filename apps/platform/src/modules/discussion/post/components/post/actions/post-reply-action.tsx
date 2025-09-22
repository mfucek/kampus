import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { FC, MouseEventHandler } from 'react';

export const PostReplyAction: FC<{
	onClick: MouseEventHandler<HTMLButtonElement>;
	selected: boolean;
}> = ({ onClick, selected }) => {
	return (
		<Button
			theme={selected ? 'accent' : 'neutral'}
			variant={selected ? 'solid' : 'solid-weak'}
			size="xs"
			onClick={onClick}
			rounded
		>
			<Icon icon="chat-single" />
			Reply
		</Button>
	);
};

export const PostReplyActionSkeleton = () => {
	return (
		<Button theme="neutral" variant={'solid-weak'} size="xs" rounded disabled>
			<Icon icon="chat-single" />
			Reply
		</Button>
	);
};
