import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { unstable_cache } from 'next/cache';

import { env } from '@/env';
import { r2Client } from './client';

const bucket = env.CLOUDFLARE_R2_BUCKET_NAME;

export const getFileDownloadUrl = async (key: string) => {
	const command = new GetObjectCommand({
		Bucket: bucket,
		Key: key
	});

	return await unstable_cache(
		async () => {
			return await getSignedUrl(r2Client, command, { expiresIn: 60 * 60 * 24 });
		},
		['file-url#' + key],
		{
			revalidate: 60 * 60 * 24
		}
	)();
};
