'use client';

import { Dialog } from '@/lib/shadcn/ui/dialog';
import { useToast } from '@/lib/shadcn/ui/use-toast';
import { FileDetailsDialogContent } from '@/modules/file/components/file-details-dialog';
import { type DocumentFileType } from '@prisma/client';
import {
	type Dispatch,
	type FC,
	type ReactNode,
	type SetStateAction,
	createContext,
	useContext,
	useState
} from 'react';
import { fileToPostFile } from '../../composer/utils/file-to-postfile';

export type DocumentOptions = {
	academicYear: string | null;
	types: DocumentFileType[];
};

export type StagedFile = {
	name: string;
	file: File;
	key: string | null;
	documentOptions: DocumentOptions;
};

const defaultData = {
	files: [],
	fileDetailsIndex: null
};

const FileStagingContext = createContext<{
	files: StagedFile[];
	setFiles: Dispatch<SetStateAction<StagedFile[]>>;
	addFile: (file: File, opts?: { openFileDetailsDialog?: boolean }) => void;
	addFiles: (files: File[], opts?: { openFileDetailsDialog?: boolean }) => void;
	removeFile: (index: number) => void;
	updateFile: (index: number, update: Partial<StagedFile>) => void;
	fileDetailsIndex: number | null;
	setFileDetailsIndex: (index: number | null) => void;
	openFileDetailsDialog: (index?: number) => void;
}>({
	...defaultData,
	setFiles: () => [],
	addFile: () => {},
	addFiles: () => {},
	removeFile: () => {},
	updateFile: () => {},
	setFileDetailsIndex: () => {},
	openFileDetailsDialog: () => {}
});

export const useFileStagingContext = () => {
	const context = useContext(FileStagingContext);

	if (!context) {
		throw new Error(
			'useFileStagingContext must be used within a FileStagingProvider'
		);
	}

	return context;
};

export const FileStagingProvider: FC<{
	children: ReactNode;
}> = ({ children }) => {
	const { toast } = useToast();

	const [files, setFiles] = useState<StagedFile[]>(defaultData.files);
	const [fileDetailsDialogOpen, setFileDetailsDialogOpen] = useState(false);
	const [fileDetailsIndex, setFileDetailsIndex] = useState<number | null>(
		defaultData.fileDetailsIndex
	);

	const addFile = (
		newFile: File,
		opts?: { openFileDetailsDialog?: boolean }
	) => {
		try {
			const sanitizedFile = fileToPostFile(newFile);
			setFiles([...files, sanitizedFile]);
			setFileDetailsIndex(files.length);

			if (opts?.openFileDetailsDialog) {
				openFileDetailsDialog(files.length);
			}
		} catch (error) {
			console.error('Error adding file:', error);
			toast({
				title: 'Nedopušteni tip datoteke',
				description: 'Dopušteni tipovi datoteka su: png, jpeg, pdf, zip',
				variant: 'danger'
			});
		}
	};

	const addFiles = (
		newFiles: File[],
		opts?: { openFileDetailsDialog?: boolean }
	) => {
		let firstDocumentIndex: number | null = null;

		const sanitizedFiles = newFiles.map((file, i) => {
			try {
				const sanitizedFile = fileToPostFile(file);

				firstDocumentIndex = firstDocumentIndex
					? firstDocumentIndex
					: files.length + i;

				return sanitizedFile;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				toast({
					title: 'Nedopušteni tip datoteke',
					description: 'Dopušteni tipovi datoteka su: png, jpeg, pdf, zip',
					variant: 'danger'
				});
				return null;
			}
		});

		const filteredSanitizedFiles = sanitizedFiles.filter(
			(file): file is StagedFile => file !== null
		);

		setFiles([...files, ...filteredSanitizedFiles]);
		setFileDetailsIndex(files.length + sanitizedFiles.length - 1);

		if (opts?.openFileDetailsDialog) {
			if (firstDocumentIndex !== null) {
				openFileDetailsDialog(firstDocumentIndex);
			}
		}
	};

	const updateFile = (updateIndex: number, update: Partial<StagedFile>) => {
		setFiles(
			files.map((file, index) =>
				index === updateIndex ? { ...file, ...update } : file
			)
		);
	};

	const removeFile = (removeIndex: number) => {
		setFiles(files.filter((_, i) => i !== removeIndex));

		let newIndex = fileDetailsIndex;

		if (fileDetailsIndex && removeIndex < fileDetailsIndex) {
			newIndex = fileDetailsIndex - 1;
		}

		// Prevent negative index
		if (newIndex && newIndex < 0) {
			newIndex = null;
		}

		setFileDetailsIndex(newIndex);
	};

	const openFileDetailsDialog = (index?: number) => {
		setFileDetailsDialogOpen(true);
		setFileDetailsIndex(index ?? null);
	};

	return (
		<FileStagingContext.Provider
			value={{
				files,
				setFiles,
				addFile,
				addFiles,
				removeFile,
				updateFile,
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
				<FileDetailsDialogContent />
			</Dialog>
		</FileStagingContext.Provider>
	);
};
