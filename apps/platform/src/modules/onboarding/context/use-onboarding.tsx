'use client';

import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/lib/shadcn/ui/dialog';
import { createContext, useContext, useState } from 'react';
import { SignInDialogContent } from '../components/sign-in-dialog-content';
interface OnboardingContextType {
	signInDialogOpen: boolean;
	showSignIn: () => void;
	hideSignIn: () => void;
}

const defaultData: OnboardingContextType = {
	showSignIn: () => {},
	hideSignIn: () => {},
	signInDialogOpen: false
};

const OnboardingContext = createContext<OnboardingContextType>({
	...defaultData
});

export const OnboardingProvider: React.FC<React.PropsWithChildren> = ({
	children
}) => {
	const [signInDialogOpen, setSignInDialogOpen] = useState(false);

	const showSignIn = () => {
		setSignInDialogOpen(true);
	};

	const hideSignIn = () => {
		setSignInDialogOpen(false);
	};

	return (
		<OnboardingContext.Provider
			value={{ signInDialogOpen, showSignIn, hideSignIn }}
		>
			{children}
		</OnboardingContext.Provider>
	);
};

export const Onboarding = () => {
	const { signInDialogOpen, hideSignIn } = useOnboarding();
	return (
		<Dialog open={signInDialogOpen} onOpenChange={hideSignIn}>
			<DialogContent>
				<DialogHeader className="hidden">
					<DialogTitle>Onboarding</DialogTitle>
					<DialogDescription>Welcome to Kampus.hr</DialogDescription>
				</DialogHeader>
				<DialogBody>
					<SignInDialogContent />
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
};

export const useOnboarding = () => {
	return useContext(OnboardingContext);
};
