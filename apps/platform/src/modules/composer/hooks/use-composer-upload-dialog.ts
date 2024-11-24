import { useComposerFilesContext } from '../contexts/composer-files-provider';

export const useComposerUploadDialog = () => {
	const { addFiles } = useComposerFilesContext();

	const openFileDialog = async () => {
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = true;
		input.onchange = async (e) => {
			const files = (e.target as HTMLInputElement).files;
			if (!files) return;

			addFiles(Array.from(files));
		};

		input.click();
	};

	return { openFileDialog };
};
