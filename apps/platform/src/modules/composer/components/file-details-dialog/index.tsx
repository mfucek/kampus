'use client';

import {
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/lib/shadcn/ui/dialog';
import { useComposerFilesContext } from '../../contexts/composer-files-provider';
import { DocumentDetails } from './document-details';
import { FileDetailsDialogActions } from './file-details-dialog-actions';
import { FileDetailsList } from './file-details-list';
import { ImageDetails } from './image-details';
import { NoFilesMessage } from './no-files-message';

export const FileDetailsDialog = () => {
	const { files, fileDetailsIndex } = useComposerFilesContext();

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
		<DialogContent className="md:h-[calc(100vh-160px)] md:max-h-[768px]">
			<DialogHeader className="hidden">
				<DialogTitle>Upload Files</DialogTitle>
				<DialogDescription>A modal component for shadcn/ui.</DialogDescription>
			</DialogHeader>

			<DialogBody className="w-full h-full overflow-y-scroll md:overflow-hidden">
				<div className="flex flex-col w-full h-full">
					<div className="flex flex-col md:flex-row gap-10 md:gap-0 w-full h-full flex-1">
						<FileDetailsList />

						<div className="flex flex-col w-full h-full md:overflow-y-auto">
							{showDocumentDetails && <DocumentDetails />}
							{showImageDetails && (
								<ImageDetails file={files[fileDetailsIndex ?? 0]!} />
							)}
							{!filesExist && <NoFilesMessage />}
						</div>
					</div>

					<FileDetailsDialogActions />
				</div>
			</DialogBody>
		</DialogContent>
	);
};
