import { env } from '@/env';

export const isDevOrStg =
	env.NEXT_PUBLIC_NODE_ENV === 'development' ||
	env.NEXT_PUBLIC_DEPLOYMENT === 'staging';

export const isStaging = env.NEXT_PUBLIC_DEPLOYMENT === 'staging';
