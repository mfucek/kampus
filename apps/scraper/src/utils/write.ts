import fs from 'fs/promises';

export const write = async (fileName: string, data: any) => {
	await fs.writeFile(fileName, JSON.stringify(data, null, 2));
};
