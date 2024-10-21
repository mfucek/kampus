'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { useEffect, useState } from 'react';
import { useTheme } from '../providers/theme-provider';

export const ThemeToggler = () => {
	const { theme, toggleTheme, canToggleTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleToggleTheme = () => {
		if (!canToggleTheme) {
			window.location.href = '/#pricing';
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
