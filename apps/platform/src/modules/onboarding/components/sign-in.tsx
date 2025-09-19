'use client';

import { useAuth } from '@/deps/better-auth/use-auth';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/lib/shadcn/ui/dialog';
import { FC } from 'react';

const SignInDialogContent = () => {
	const { signInWithGoogle } = useAuth();

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Sign In</DialogTitle>
			</DialogHeader>

			<DialogBody>
				<Button onClick={() => signInWithGoogle()}>Sign in with Google</Button>
			</DialogBody>
		</DialogContent>
	);
};

export const SignIn: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<Dialog>
			<SignInDialogContent />

			<DialogTrigger asChild>{children}</DialogTrigger>
		</Dialog>
	);
};
