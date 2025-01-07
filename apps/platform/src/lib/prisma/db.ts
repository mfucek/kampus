import { PrismaClient } from '@prisma/client';

import { env } from '@/env';

const createPrismaClient = () =>
	new PrismaClient({
		log: ['error']
	});

const globalForPrisma = globalThis as unknown as {
	prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

// db.$on('query', (e) => {
// 	console.log('Query: ' + e.query);
// 	console.log('Params: ' + e.params);
// 	console.log('Duration: ' + e.duration + 'ms');
// });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
