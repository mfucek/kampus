import { useUploadToPost } from '@/modules/file/hooks/use-upload-to-post';
import { type DragEvent, useState } from 'react';

export const useSelectFiles = () => {
	const [dragging, setDragging] = useState(false);
	const { files, addFile, removeFile, commitFiles, linkFiles } =
		useUploadToPost();

	const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragging(false);

		const fileList = [];
		for (const file of e.dataTransfer?.files ?? []) {
			fileList.push(file);
		}

		await Promise.all(fileList.map((file) => addFile(file)));
	};

	const containerProps = {
		onDragOver: (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setDragging(true);
		},
		onDragLeave: (e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setDragging(false);
		},
		onDrop: handleDrop
	};

	return {
		containerProps,
		files,
		isDragging: dragging,
		removeFile,
		commitFiles,
		linkFiles
	};
};
