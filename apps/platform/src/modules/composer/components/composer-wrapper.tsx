import { type FC, type ReactNode } from 'react';

import { cn } from '@/lib/shadcn/utils';
import { useFileStagingContext } from '@/modules/file/contexts/file-staging-provider';
import {
	UploadAreaOverlay,
	useUploadArea
} from '@/modules/file/hooks/use-upload-area';

export const ComposerWrapper: FC<{
	children: ReactNode;
	className?: string;
}> = ({ children, className }) => {
	const { addFiles } = useFileStagingContext();
	const { uploadAreaProps, isDragging } = useUploadArea(addFiles);
	return (
		<div
			className={cn(
				'flex flex-col gap-3 w-full relative',
				'rounded-xl overflow-hidden p-3',
				'md:border md:border-neutral-medium',
				'bg-section',
				className
			)}
			{...uploadAreaProps}
		>
			{children}
			<UploadAreaOverlay isDragging={isDragging ?? false} />
		</div>
	);
};
