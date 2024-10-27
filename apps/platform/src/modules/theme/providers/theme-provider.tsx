'use client';

import { api } from '@/lib/trpc/react';
import { useAuth } from '@clerk/nextjs';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
	canToggleTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [theme, setTheme] = useState<Theme>('light');
	const [canToggleTheme, setCanToggleTheme] = useState<boolean | undefined>(
		undefined
	);
	const { isSignedIn } = useAuth();
	const { data: account } = api.account.getAccount.useQuery(void {}, {
		enabled: isSignedIn
	});

	useEffect(() => {
		if (account) {
			setCanToggleTheme(
				['MONTHLY_CHEAP', 'MONTHLY_PRO', 'LIFETIME'].includes(account.package!)
			);
		} else {
			setCanToggleTheme(false);
		}
	}, [account]);

	useEffect(() => {
		if (canToggleTheme === false) {
			setTheme('light');
		}
		if (canToggleTheme === true) {
			if (typeof window !== 'undefined') {
				const storedTheme = localStorage.getItem('theme') as Theme | null;

				setTheme(storedTheme || 'light');
			}
		}
	}, [canToggleTheme]);

	useEffect(() => {
		if (theme === 'dark') {
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
		}
		if (canToggleTheme !== undefined) {
			localStorage.setItem('theme', theme);
		}
	}, [theme]);

	const toggleTheme = () => {
		if (canToggleTheme === true) {
			setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
		}
	};

	return (
		<ThemeContext.Provider
			value={{ theme, toggleTheme, canToggleTheme: !!canToggleTheme }}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
