import { getFileUploadUrl } from '@/lib/s3/get-file-upload-url';
import { protectedProcedure } from '@/server/api/trpc';
import { nanoid } from 'nanoid';

export const getUploadUrlProcedure = protectedProcedure.mutation(async () => {
	const key = nanoid();

	const url = await getFileUploadUrl(key);

	return { url, key };
});
