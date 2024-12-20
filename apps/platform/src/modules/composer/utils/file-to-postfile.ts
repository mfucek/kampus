import type { FileType } from '@prisma/client';
import type {
	DocumentOptions,
	StagedFile
} from '../../file/contexts/file-staging-provider';

const fileTypeToFileType = (type: string): FileType => {
	if (['image/png', 'image/jpeg'].includes(type)) return 'IMAGE';
	if (['application/pdf'].includes(type)) return 'PDF';
	if (['application/zip'].includes(type)) return 'ARCHIVE';

	throw new Error('Invalid file type');
};

export const fileToPostFile = (file: File): StagedFile => {
	const type = fileTypeToFileType(file.type);

	let documentOptions: DocumentOptions | null = null;
	if (type === 'PDF' || type === 'ARCHIVE') {
		documentOptions = {
			academicYear: null,
			types: []
		};
	}

	return {
		file,
		name: file.name,
		type: fileTypeToFileType(file.type),
		key: null,
		documentOptions
	};
};
