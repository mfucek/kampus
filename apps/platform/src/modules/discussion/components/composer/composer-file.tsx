import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { FC } from 'react';

export const ComposerFile: FC<{
	onRemove: () => void;
	onClick: () => void;
}> = ({ onRemove, onClick }) => {
	return (
		<div className="flex flex-col w-20 h-20 bg-neutral-strong rounded-lg">
			<Button variant="ghost" iconOnly onClick={onRemove}>
				<Icon icon="close" />
			</Button>
		</div>
	);
};
