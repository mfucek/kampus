import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { headers } from 'next/headers';

import { NextRequest } from 'next/server';

import { db } from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

// type AuthObject = ReturnType<typeof getAuth>;

/* CONTEXT */
export const createTRPCContext = async (opts: {
	headers: Headers;
	// auth: AuthObject;
}) => {
	return {
		db,
		// clerkUserId: opts.auth.userId
		auth: null,
		...opts
	};
};

/* INITIALIZATION */
export const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
			}
		};
	}
});

/* Create a server-side caller. */
export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
	const start = Date.now();

	if (process.env.NODE_ENV !== 'production') {
		// artificial delay in dev
		const waitMs = Math.floor(Math.random() * 200) + 500;
		await new Promise((resolve) => setTimeout(resolve, waitMs));
	}

	const result = await next();

	const end = Date.now();
	console.log(`\n[TRPC] ${path} took ${end - start}ms to execute`);

	return result;
});

export const publicProcedure = t.procedure;
// .use(timingMiddleware);

export const optionalAuthMiddleware = t.middleware(async ({ ctx, next }) => {
	let auth: ReturnType<typeof getAuth> | null = null;
	let user: User | null = null;

	auth = getAuth(
		new NextRequest('https://notused.com', {
			headers: await headers()
		})
	);

	user = auth?.userId
		? await db.user.findFirst({
				where: {
					Account: {
						clerkUserId: auth.userId
					}
				}
			})
		: null;

	return next({ ctx: { ...ctx, auth, user } });
});

const strictAuthMiddleware = t.middleware(async ({ ctx, next }) => {
	const auth = getAuth(
		new NextRequest('https://notused.com', {
			headers: await headers()
		})
	);
	const clerkUserId = auth.userId;

	if (!clerkUserId) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	const account = await db.account.findUnique({
		where: {
			clerkUserId
		},
		include: {
			user: true
		}
	});

	if (!account) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	const user = account.user;

	if (!user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return next({ ctx: { ...ctx, auth, user } });
});

export const protectedProcedure = t.procedure
	// .use(timingMiddleware)
	.use(strictAuthMiddleware);
