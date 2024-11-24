'use client';

import { Dialog } from '@/lib/shadcn/ui/dialog';
import { useToast } from '@/lib/shadcn/ui/use-toast';
import { DocumentFileType, FileType } from '@prisma/client';
import {
	type FC,
	type ReactNode,
	createContext,
	useContext,
	useState
} from 'react';
import { FileDetailsDialog } from '../components/file-details-dialog';
import { fileToPostFile } from '../utils/file-to-postfile';

export type DocumentOptions = {
	academicYear: string | null;
	types: DocumentFileType[];
};

export type PostFile = {
	name: string;
	file: File;
	type: FileType;
	key: string | null;
	documentOptions: DocumentOptions | null;
};

const defaultData = {
	files: []
};

const ComposerFilesContext = createContext<{
	files: PostFile[];
	setFiles: (files: PostFile[]) => void;
	addFile: (file: File) => void;
	addFiles: (files: File[]) => void;
	removeFile: (index: number) => void;
	fileDetailsIndex: number | null;
	setFileDetailsIndex: (index: number | null) => void;
	openFileDetailsDialog: (index?: number) => void;
}>({
	...defaultData,
	setFiles: () => {},
	addFile: () => {},
	addFiles: () => {},
	removeFile: () => {},
	fileDetailsIndex: null,
	setFileDetailsIndex: () => {},
	openFileDetailsDialog: () => {}
});

export const useComposerFilesContext = () => {
	const context = useContext(ComposerFilesContext);

	if (!context) {
		throw new Error('useComposer must be used within a ComposerFilesProvider');
	}

	return context;
};

export const ComposerFilesProvider: FC<{
	children: ReactNode;
}> = ({ children }) => {
	const { toast } = useToast();

	const [files, setFiles] = useState<PostFile[]>(defaultData.files);
	const [fileDetailsDialogOpen, setFileDetailsDialogOpen] = useState(false);
	const [fileDetailsIndex, setFileDetailsIndex] = useState<number | null>(null);

	const addFile = (newFile: File) => {
		try {
			const sanitizedFile = fileToPostFile(newFile);
			setFiles([...files, sanitizedFile]);
			setFileDetailsIndex(files.length);

			if (sanitizedFile.type === 'IMAGE' || sanitizedFile.type === 'PDF') {
				openFileDetailsDialog(files.length);
			}
		} catch (error) {
			console.error('Error adding file:', error);
			toast({
				title: 'Greška pri dodavanju datoteke.',
				description: 'Nepodržani tip datoteke.',
				variant: 'danger'
			});
		}
	};

	const addFiles = (newFiles: File[]) => {
		let firstImageOrPdfIndex: number | null = null;

		const sanitizedFiles = newFiles.map((file) => {
			try {
				const sanitizedFile = fileToPostFile(file);

				if (sanitizedFile.type === 'IMAGE' || sanitizedFile.type === 'PDF') {
					firstImageOrPdfIndex = files.length;
				}

				return sanitizedFile;
			} catch (error) {
				toast({
					title: 'Greška pri dodavanju datoteke.',
					description: 'Nepodržani tip datoteke.',
					variant: 'danger'
				});
				return null;
			}
		});

		const filteredSanitizedFiles = sanitizedFiles.filter(
			(file): file is PostFile => file !== null
		);

		setFiles([...files, ...filteredSanitizedFiles]);
		setFileDetailsIndex(files.length + sanitizedFiles.length - 1);

		if (firstImageOrPdfIndex) {
			openFileDetailsDialog(firstImageOrPdfIndex);
		}
	};

	const removeFile = (removeIndex: number) => {
		console.log('removeIndex', removeIndex);
		console.log('fileDetailsIndex', fileDetailsIndex);
		console.log('files.length', files.length);

		setFiles(files.filter((_, i) => i !== removeIndex));

		let newIndex = fileDetailsIndex;

		if (fileDetailsIndex && removeIndex < fileDetailsIndex) {
			newIndex = fileDetailsIndex - 1;
		}

		// Prevent negative index
		if (newIndex && newIndex < 0) {
			newIndex = null;
		} else console.log('setting newIndex to', newIndex);

		setFileDetailsIndex(newIndex);
	};

	const openFileDetailsDialog = (index?: number) => {
		setFileDetailsDialogOpen(true);
		setFileDetailsIndex(index ?? null);
	};

	return (
		<ComposerFilesContext.Provider
			value={{
				files,
				setFiles,
				addFile,
				addFiles,
				removeFile,
				fileDetailsIndex,
				setFileDetailsIndex,
				openFileDetailsDialog
			}}
		>
			<Dialog
				open={fileDetailsDialogOpen}
				onOpenChange={setFileDetailsDialogOpen}
			>
				{children}
				<FileDetailsDialog />
			</Dialog>
		</ComposerFilesContext.Provider>
	);
};
