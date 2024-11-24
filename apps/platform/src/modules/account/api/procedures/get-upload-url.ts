import { getS3UploadPresignedUrl } from '@/lib/s3';
import { protectedProcedure } from '@/server/api/trpc';
import { nanoid } from 'nanoid';

export const getUploadUrlProcedure = protectedProcedure.mutation(async () => {
	const key = nanoid();

	const url = await getS3UploadPresignedUrl(key);

	return { url, key };
});
