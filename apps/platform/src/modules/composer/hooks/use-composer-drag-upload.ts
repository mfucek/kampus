'use client';

import { type DragEvent, useState } from 'react';

import { useComposerFilesContext } from '../contexts/composer-files-provider';

export const useComposerDragUpload = () => {
	const { addFiles } = useComposerFilesContext();
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
