import { auth } from '@/deps/better-auth/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const handler = toNextJsHandler(auth);
