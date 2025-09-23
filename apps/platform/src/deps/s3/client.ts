import { env } from '@/env';
import { S3Client } from '@aws-sdk/client-s3';

export const r2Client = new S3Client({
	region: 'auto',
	endpoint: env.CLOUDFLARE_ENDPOINT,
	credentials: {
		accessKeyId: env.CLOUDFLARE_ACCESS_ID,
		secretAccessKey: env.CLOUDFLARE_ACCESS_KEY
	}
});
