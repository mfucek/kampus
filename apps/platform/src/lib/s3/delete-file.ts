import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { env } from '@/env';
import { r2Client } from './client';

const bucket = env.CLOUDFLARE_R2_BUCKET_NAME;

export const deleteFile = async (key: string) => {
	const command = new DeleteObjectCommand({
		Bucket: bucket,
		Key: key
	});

	return await r2Client.send(command);
};
