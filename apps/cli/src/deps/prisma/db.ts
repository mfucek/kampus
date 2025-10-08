import { PrismaClient } from '@prisma/client';

import { env } from '@/env';

export const createPrismaClient = (environment: 'production' | 'staging') =>
	(db = new PrismaClient({
		datasourceUrl:
			environment === 'production'
				? env.DATABASE_URL_PRODUCTION
				: env.DATABASE_URL_STAGING
	}));

export let db = undefined as unknown as PrismaClient;
