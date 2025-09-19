import { env } from '@/env';
import { createAuthClient } from 'better-auth/client';

const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_URL
});

const signIn = async () => {
	const data = await authClient.signIn.social({
		provider: 'google'
	});
};
