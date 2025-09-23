import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import packageJson from '../package.json' assert { type: 'json' };

/* global process */
const version = packageJson.version;

export const env = createEnv({
	server: {
		// Environment
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),

		// Database (Prisma)
		DATABASE_URL: z.string().url(),

		// Auth (Better Auth)
		BETTER_AUTH_SECRET: z.string(),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),

		// Object Storage (Cloudflare)
		CLOUDFLARE_ACCESS_ID: z.string(),
		CLOUDFLARE_ACCESS_KEY: z.string(),
		CLOUDFLARE_ENDPOINT: z.string(),
		CLOUDFLARE_R2_BUCKET_NAME: z.string()
	},

	client: {
		// Environment
		NEXT_PUBLIC_NODE_ENV: z.enum(['development', 'staging', 'production']),
		NEXT_PUBLIC_URL: z.string(),
		NEXT_PUBLIC_DEPLOYMENT: z.enum(['staging', 'production']),
		NEXT_PUBLIC_VERSION: z.string()
	},

	runtimeEnv: {
		// Environment
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_DEPLOYMENT: process.env.NEXT_PUBLIC_DEPLOYMENT,
		NEXT_PUBLIC_VERSION: version,
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,

		// Database (Prisma)
		DATABASE_URL: process.env.DATABASE_URL,

		// Auth (Better Auth)
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

		// Object Storage (Cloudflare)
		CLOUDFLARE_ACCESS_ID: process.env.CLOUDFLARE_ACCESS_ID,
		CLOUDFLARE_ACCESS_KEY: process.env.CLOUDFLARE_ACCESS_KEY,
		CLOUDFLARE_ENDPOINT: process.env.CLOUDFLARE_ENDPOINT,
		CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME
	},

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true
});
