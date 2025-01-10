'use client';

import {
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/lib/shadcn/ui/dialog';
import { useFileStagingContext } from '../../../file/contexts/file-staging-provider';
import {
	UploadAreaOverlay,
	useUploadArea
} from '../../../file/hooks/use-upload-area';
import { DocumentDetails } from './document-details';
import { FileDetailsDialogActions } from './file-details-dialog-actions';
import { FileDetailsList } from './file-details-list';
import { NoFilesMessage } from './no-files-message';

export const FileDetailsDialog = () => {
	const { files, fileDetailsIndex, addFiles } = useFileStagingContext();
	const { uploadAreaProps, isDragging } = useUploadArea(addFiles);

	const filesExist = files.length > 0;

	const fileIsSelected = fileDetailsIndex !== null;

	const showDocumentDetails =
		filesExist && fileIsSelected && files[fileDetailsIndex];

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
							{!filesExist && <NoFilesMessage />}
						</div>
					</div>

					<FileDetailsDialogActions />
				</div>

				<UploadAreaOverlay isDragging={isDragging} />
			</DialogBody>
		</DialogContent>
	);
};
