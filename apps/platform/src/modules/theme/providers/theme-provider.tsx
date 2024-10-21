'use client';

import { api } from '@/lib/trpc/react';
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
	const [theme, setTheme] = useState<Theme>(() => {
		// Check localStorage and system preference on initial render
		if (typeof window !== 'undefined') {
			const storedTheme = localStorage.getItem('theme') as Theme | null;
			if (storedTheme) {
				return storedTheme;
			}
			return window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
		}
		return 'light'; // Default for server-side rendering
	});
	const [canToggleTheme, setCanToggleTheme] = useState(false);
	const { data: account } = api.account.getAccount.useQuery();

	useEffect(() => {
		if (account) {
			setCanToggleTheme(
				['MONTHLY_CHEAP', 'MONTHLY_MEDIUM'].includes(account.package!)
			);
		}
	}, [account]);

	useEffect(() => {
		if (theme === 'dark') {
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
		}
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		if (canToggleTheme) {
			setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
		}
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, canToggleTheme }}>
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
