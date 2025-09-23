import { useStore } from '@nanostores/react';
import { authClient } from './auth-client';

const { useSession } = authClient;

export const useAuth = () => {
	const { data: session, isPending, error } = useStore(useSession);

	const user = session?.user;

	const signInWithGoogle = async () => {
		await authClient.signIn.social({
			provider: 'google'
		});
	};

	const signOut = async () => {
		await authClient.signOut();
	};

	return {
		session,
		isPending,
		error,
		user,
		isSignedIn: !!session,
		signInWithGoogle,
		signOut
	};
};
