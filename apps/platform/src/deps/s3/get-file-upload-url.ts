import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { env } from '@/env';
import { r2Client } from './client';

const bucket = env.CLOUDFLARE_R2_BUCKET_NAME;

export const getFileUploadUrl = async (key: string) => {
	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: key
	});

	return await getSignedUrl(r2Client, command, { expiresIn: 60 * 60 * 24 });
};
