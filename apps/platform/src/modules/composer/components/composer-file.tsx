import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { FC } from 'react';
import { PostFile } from '../contexts/composer-files-provider';

export const ComposerFile: FC<{
	file: PostFile;
	onRemove: () => void;
	onClick: () => void;
}> = ({ onRemove, onClick }) => {
	return (
		<div
			className="flex flex-col w-20 h-20 grow-0 shrink-0 bg-neutral-strong rounded-lg clickable"
			onClick={onClick}
		>
			<Button
				variant="ghost"
				iconOnly
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
			>
				<Icon icon="close" />
			</Button>
		</div>
	);
};
