import type {
	DocumentOptions,
	StagedFile
} from '../../file/contexts/file-staging-provider';

export const fileToPostFile = (file: File): StagedFile => {
	const documentOptions: DocumentOptions = {
		academicYear: null,
		types: []
	};

	return {
		file,
		name: file.name,
		key: null,
		documentOptions
	};
};
