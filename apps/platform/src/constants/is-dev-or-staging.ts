import { env } from '@/env';

export const isDevOrStg =
	env.NODE_ENV === 'development' || env.NEXT_PUBLIC_DEPLOYMENT === 'staging';
