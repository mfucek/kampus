'use client';

import { type FC, useEffect, useState } from 'react';

import { Icon } from '@/global/components/icon';
import { Button, type ButtonProps } from '@/lib/shadcn/ui/button';
import { useTheme } from '../providers/theme-provider';

export const ThemeToggler: FC<ButtonProps> = ({ ...props }) => {
	const { theme, toggleTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Button variant="ghost" iconOnly onClick={toggleTheme} {...props}>
			<Icon icon={theme === 'light' ? 'moon' : 'sun'} />
		</Button>
	);
};
