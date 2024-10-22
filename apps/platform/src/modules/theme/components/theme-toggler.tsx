'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useTheme } from '../providers/theme-provider';

export const ThemeToggler = () => {
	const { theme, toggleTheme, canToggleTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const { isSignedIn } = useAuth();
	const { openSignIn } = useClerk();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleToggleTheme = () => {
		if (!canToggleTheme) {
			if (isSignedIn) {
				window.location.href = '/profile#subscription-plan';
			} else {
				openSignIn();
			}
			return;
		}
		toggleTheme();
	};

	if (!mounted) {
		return null; // Return null on server-side and initial client-side render
	}

	return (
		<Button variant="ghost" iconOnly onClick={handleToggleTheme}>
			<Icon icon={theme === 'light' ? 'moon' : 'sun'} />
		</Button>
	);
};
