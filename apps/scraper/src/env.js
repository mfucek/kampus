import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		DATABASE_URL_PRODUCTION: z.string().url(),
		DATABASE_URL_STAGING: z.string().url(),
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development')
	},

	client: {},

	runtimeEnv: {
		DATABASE_URL_PRODUCTION: process.env.DATABASE_URL_PRODUCTION,
		DATABASE_URL_STAGING: process.env.DATABASE_URL_STAGING,
		NODE_ENV: process.env.NODE_ENV
	},

	skipValidation: false,
	emptyStringAsUndefined: true
});
