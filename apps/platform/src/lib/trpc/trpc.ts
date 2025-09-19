import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { auth } from '@/lib/better-auth/auth';
import { db } from '@/lib/db';

// type AuthObject = ReturnType<typeof getAuth>;

/* CONTEXT */
export const createTRPCContext = async (opts: {
	headers: Headers;
	// auth: AuthObject;
}) => {
	const authSession = await auth.api.getSession({
		headers: opts.headers
	});

	const source = opts.headers.get('x-trpc-source') ?? 'unknown';
	console.log('>>> tRPC Request from', source, 'by', authSession?.user.email);

	return {
		db,
		user: authSession?.user,
		...opts
	};
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/* INITIALIZATION */
export const t = initTRPC.context<Context>().create({
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

export const publicProcedure = t.procedure;

export const optionalAuthMiddleware = t.middleware(async ({ ctx, next }) => {
	const user = ctx.user;

	return next({
		ctx: {
			...ctx,
			user: user ?? null
		}
	});
});

const requiredAuthMiddleware = t.middleware(async ({ ctx, next }) => {
	if (!ctx.user?.id) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return next({
		ctx: {
			...ctx,
			user: ctx.user
		}
	});
});

export const protectedProcedure = t.procedure.use(requiredAuthMiddleware);
