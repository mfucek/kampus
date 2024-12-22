'use client';

import { Icon } from '@/global/components/icon';
import { cn } from '@/lib/shadcn/utils';
import { type DragEvent, type FC, type HTMLAttributes, useState } from 'react';

export const useUploadArea = (addFiles: (files: File[]) => void) => {
	const [isDragging, setIsDragging] = useState(false);

	const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const fileList: File[] = [];
		for (const file of e.dataTransfer?.files ?? []) {
			fileList.push(file);
		}

		addFiles(fileList);
	};

	const uploadAreaProps = {
		onDragOver: (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(true);
		},
		onDragLeave: (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);
		},
		onDrop: handleDrop
	};

	return { uploadAreaProps, isDragging };
};

export const UploadArea: FC<
	HTMLAttributes<HTMLDivElement> & {
		addFiles: Parameters<typeof useUploadArea>[0];
	}
> = ({ children, className, addFiles, ...props }) => {
	const { uploadAreaProps, isDragging } = useUploadArea(addFiles);

	return (
		<div {...uploadAreaProps} {...props} className={cn('relative', className)}>
			{children}
			<UploadAreaOverlay isDragging={isDragging} />
		</div>
	);
};

export const UploadAreaOverlay: FC<{ isDragging: boolean }> = ({
	isDragging
}) => {
	return (
		<div
			className={cn(
				'absolute flex items-center justify-center duration-300 inset-2 bg-accent-medium backdrop-blur-sm rounded-xl pointer-events-none bg-opacity-50 border border-accent-strong',
				isDragging ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
			)}
		>
			<Icon icon="add-circle" size={32} className="bg-accent bg-opacity-100" />
		</div>
	);
};
