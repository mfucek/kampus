import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import packageJson from '../package.json' assert { type: 'json' };

const version = packageJson.version;

export const env = createEnv({
	server: {
		// Environment
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),
		URL: z.string(),

		// Database (Prisma)
		DATABASE_URL: z.string().url(),

		// Auth (Clerk)
		CLERK_SECRET_KEY: z.string(),
		CLERK_WEBHOOK_SECRET: z.string(),

		// Payment (Stripe)
		STRIPE_SECRET_KEY: z.string(),
		STRIPE_WEBHOOK_SECRET: z.string(),
		STRIPE_PRODUCT_ID_MONTHLY_CHEAP: z.string(),
		STRIPE_PRODUCT_ID_MONTHLY_PRO: z.string(),
		STRIPE_PRODUCT_ID_LIFETIME: z.string(),
		STRIPE_PRICE_ID_MONTHLY_CHEAP: z.string(),
		STRIPE_PRICE_ID_MONTHLY_PRO: z.string(),
		STRIPE_PRICE_ID_LIFETIME: z.string(),

		// Object Storage (Cloudflare)
		CLOUDFLARE_ACCESS_ID: z.string(),
		CLOUDFLARE_ACCESS_KEY: z.string(),
		CLOUDFLARE_ENDPOINT: z.string(),
		CLOUDFLARE_R2_BUCKET_NAME: z.string()
	},

	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_DEPLOYMENT: z.enum(['staging', 'production']),
		NEXT_PUBLIC_VERSION: z.string()
	},

	runtimeEnv: {
		// Environment
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_DEPLOYMENT: process.env.NEXT_PUBLIC_DEPLOYMENT,
		NEXT_PUBLIC_VERSION: version,

		// Database (Prisma)
		DATABASE_URL: process.env.DATABASE_URL,

		// Auth (Clerk)
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

		// Payment (Stripe)
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		STRIPE_PRODUCT_ID_MONTHLY_CHEAP:
			process.env.STRIPE_PRODUCT_ID_MONTHLY_CHEAP,
		STRIPE_PRODUCT_ID_MONTHLY_PRO: process.env.STRIPE_PRODUCT_ID_MONTHLY_PRO,
		STRIPE_PRODUCT_ID_LIFETIME: process.env.STRIPE_PRODUCT_ID_LIFETIME,
		STRIPE_PRICE_ID_MONTHLY_CHEAP: process.env.STRIPE_PRICE_ID_MONTHLY_CHEAP,
		STRIPE_PRICE_ID_MONTHLY_PRO: process.env.STRIPE_PRICE_ID_MONTHLY_PRO,
		STRIPE_PRICE_ID_LIFETIME: process.env.STRIPE_PRICE_ID_LIFETIME,
		URL: process.env.URL,

		// Object Storage (Cloudflare)
		CLOUDFLARE_ACCESS_ID: process.env.CLOUDFLARE_ACCESS_ID,
		CLOUDFLARE_ACCESS_KEY: process.env.CLOUDFLARE_ACCESS_KEY,
		CLOUDFLARE_ENDPOINT: process.env.CLOUDFLARE_ENDPOINT,
		CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME
	},

	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true
});
