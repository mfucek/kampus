import { deleteFile } from './delete-file';

export const deleteFiles = async (keys: string[]) => {
	const response = keys.map(async (key) => {
		return await deleteFile(key);
	});

	return Promise.all(response);
};
