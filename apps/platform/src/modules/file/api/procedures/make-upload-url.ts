import { getFileUploadUrl } from '@/deps/s3/get-file-upload-url';
import { protectedProcedure } from '@/deps/trpc/trpc';
import { nanoid } from 'nanoid';

export const makeUploadUrlProcedure = protectedProcedure //
	.mutation(async () => {
		const key = nanoid();
		const url = await getFileUploadUrl(key);
		return { url, key };
	});
