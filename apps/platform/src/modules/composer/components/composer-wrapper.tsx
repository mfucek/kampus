'use client';

import { type FC, type ReactNode } from 'react';

import { Icon } from '@/global/components/icon';
import { cn } from '@/lib/shadcn/utils';
import { useFileStagingContext } from '@/modules/file/contexts/file-staging-provider';
import {
	UploadAreaOverlay,
	useUploadArea
} from '@/modules/file/hooks/use-upload-area';
import { useAuth } from '@clerk/nextjs';

export const ComposerWrapper: FC<{
	children: ReactNode;
	className?: string;
}> = ({ children, className }) => {
	const { addFiles } = useFileStagingContext();
	const { uploadAreaProps, isDragging } = useUploadArea(addFiles);

	const { isSignedIn } = useAuth();

	return (
		<div
			className={cn(
				'flex flex-col gap-3 w-full relative',
				'rounded-xl overflow-hidden p-3',
				'border border-neutral-weak',
				isSignedIn && 'bg-section',
				!isSignedIn && 'bg-section md:bg-neutral-weak',
				className
			)}
			{...uploadAreaProps}
		>
			{children}

			<UploadAreaOverlay isDragging={isDragging ?? false} />

			{!isSignedIn && (
				<div className="inset-0 absolute pointer-events-none flex flex-row justify-center items-center p-3 gap-1">
					<Icon icon="status-warning" size={16} className="bg-neutral-strong" />
					<p className="body-2 text-neutral-strong">
						Ulogiraj se da možeš objavljivati.
					</p>
				</div>
			)}
		</div>
	);
};
