import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import packageJson from '../package.json' assert { type: 'json' };

const version = packageJson.version;

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		DATABASE_URL: z.string().url(),
		DIRECT_URL: z.string().url(),
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),
		CLERK_SECRET_KEY: z.string(),
		CLERK_WEBHOOK_SECRET: z.string(),
		STRIPE_SECRET_KEY: z.string(),
		STRIPE_WEBHOOK_SECRET: z.string(),
		URL: z.string(),
		AWS_REGION: z.string(),
		AMPLIFY_BUCKET: z.string(),
		AMPLIFY_ACCESS_KEY_ID: z.string(),
		AMPLIFY_SECRET_ACCESS_KEY: z.string(),
		STRIPE_PRODUCT_ID_MONTHLY_CHEAP: z.string(),
		STRIPE_PRODUCT_ID_MONTHLY_PRO: z.string(),
		STRIPE_PRODUCT_ID_LIFETIME: z.string(),
		STRIPE_PRICE_ID_MONTHLY_CHEAP: z.string(),
		STRIPE_PRICE_ID_MONTHLY_PRO: z.string(),
		STRIPE_PRICE_ID_LIFETIME: z.string()
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		// NEXT_PUBLIC_CLIENTVAR: z.string(),
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_DEPLOYMENT: z.enum(['staging', 'production']),
		NEXT_PUBLIC_VERSION: z.string()
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		DIRECT_URL: process.env.DIRECT_URL,
		NODE_ENV: process.env.NODE_ENV,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		URL: process.env.URL,
		AWS_REGION: process.env.AWS_REGION,
		AMPLIFY_BUCKET: process.env.AMPLIFY_BUCKET,
		AMPLIFY_ACCESS_KEY_ID: process.env.AMPLIFY_ACCESS_KEY_ID,
		AMPLIFY_SECRET_ACCESS_KEY: process.env.AMPLIFY_SECRET_ACCESS_KEY,
		STRIPE_PRODUCT_ID_MONTHLY_CHEAP:
			process.env.STRIPE_PRODUCT_ID_MONTHLY_CHEAP,
		STRIPE_PRODUCT_ID_MONTHLY_PRO: process.env.STRIPE_PRODUCT_ID_MONTHLY_PRO,
		STRIPE_PRODUCT_ID_LIFETIME: process.env.STRIPE_PRODUCT_ID_LIFETIME,
		STRIPE_PRICE_ID_MONTHLY_CHEAP: process.env.STRIPE_PRICE_ID_MONTHLY_CHEAP,
		STRIPE_PRICE_ID_MONTHLY_PRO: process.env.STRIPE_PRICE_ID_MONTHLY_PRO,
		STRIPE_PRICE_ID_LIFETIME: process.env.STRIPE_PRICE_ID_LIFETIME,
		NEXT_PUBLIC_DEPLOYMENT: process.env.NEXT_PUBLIC_DEPLOYMENT,
		NEXT_PUBLIC_VERSION: version
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true
});
