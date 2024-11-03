'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { type FC, useEffect, useState } from 'react';

import { Icon } from '@/global/components/icon';
import { Button, type ButtonProps } from '@/lib/shadcn/ui/button';
import { useTheme } from '../providers/theme-provider';

export const ThemeToggler: FC<ButtonProps> = ({ ...props }) => {
	const { theme, toggleTheme, canToggleTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const { isSignedIn } = useAuth();
	const { openSignIn } = useClerk();

	const router = useRouter();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleToggleTheme = () => {
		if (!canToggleTheme) {
			if (isSignedIn) {
				router.push('/profile#subscription-plan');
			} else {
				openSignIn();
			}
			return;
		}
		toggleTheme();
	};

	if (!mounted) {
		return null;
	}

	return (
		<Button variant="ghost" iconOnly onClick={handleToggleTheme} {...props}>
			<Icon icon={theme === 'light' ? 'moon' : 'sun'} />
		</Button>
	);
};
