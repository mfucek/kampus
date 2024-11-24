'use client';

import {
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/lib/shadcn/ui/dialog';
import { cn } from '@/lib/shadcn/utils';
import { useComposerFilesContext } from '../../contexts/composer-files-provider';
import { useComposerDragUpload } from '../../hooks/use-composer-drag-upload';
import { DocumentDetails } from './document-details';
import { FileDetailsDialogActions } from './file-details-dialog-actions';
import { FileDetailsList } from './file-details-list';
import { ImageDetails } from './image-details';
import { NoFilesMessage } from './no-files-message';

export const FileDetailsDialog = () => {
	const { files, fileDetailsIndex } = useComposerFilesContext();
	const { uploadAreaProps, isDragging } = useComposerDragUpload();

	const filesExist = files.length > 0;

	const fileIsSelected = fileDetailsIndex !== null;

	const showDocumentDetails =
		filesExist &&
		fileIsSelected &&
		files[fileDetailsIndex] &&
		['PDF', 'ARCHIVE'].includes(files[fileDetailsIndex].type);

	const showImageDetails =
		filesExist &&
		fileIsSelected &&
		files[fileDetailsIndex] &&
		files[fileDetailsIndex].type === 'IMAGE';

	return (
		<DialogContent
			className="md:h-[calc(100vh-160px)] md:max-h-[768px]"
			{...uploadAreaProps}
		>
			<DialogHeader className="hidden">
				<DialogTitle>Uploadaj datoteke</DialogTitle>
				<DialogDescription>
					Uploadaj datoteke koje želiš objaviti na platformi.
				</DialogDescription>
			</DialogHeader>

			<DialogBody className="w-full h-full overflow-y-scroll md:overflow-hidden relative">
				<div className="flex flex-col w-full h-full">
					<div className="flex flex-col md:flex-row gap-10 md:gap-0 w-full h-full flex-1">
						<FileDetailsList />

						<div className="flex flex-col w-full h-full md:overflow-y-auto">
							{showDocumentDetails && (
								<DocumentDetails key={fileDetailsIndex} />
							)}
							{showImageDetails && <ImageDetails key={fileDetailsIndex} />}
							{!filesExist && <NoFilesMessage />}
						</div>
					</div>

					<FileDetailsDialogActions />
				</div>

				<div
					className={cn(
						'absolute duration-300 inset-2 bg-accent-medium backdrop-blur-sm rounded-xl pointer-events-none bg-opacity-20',
						isDragging ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
					)}
				/>
			</DialogBody>
		</DialogContent>
	);
};
