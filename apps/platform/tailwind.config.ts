import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.tsx'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)', ...fontFamily.sans]
			},
			colors: {
				section: {
					DEFAULT: 'var(--color-section)',
					strong: 'var(--color-section-strong)'
				},
				background: 'var(--color-background)',
				accent: {
					DEFAULT: 'var(--color-accent-default)',
					strong: 'var(--color-accent-strong)',
					medium: 'var(--color-accent-medium)',
					weak: 'var(--color-accent-weak)',
					contrast: 'var(--color-accent-contrast)'
				},
				neutral: {
					DEFAULT: 'var(--color-neutral-default)',
					strong: 'var(--color-neutral-strong)',
					medium: 'var(--color-neutral-medium)',
					weak: 'var(--color-neutral-weak)',
					contrast: 'var(--color-neutral-contrast)'
				},
				success: {
					DEFAULT: 'var(--color-success-default)',
					strong: 'var(--color-success-strong)',
					medium: 'var(--color-success-medium)',
					weak: 'var(--color-success-weak)',
					contrast: 'var(--color-success-contrast)'
				},
				danger: {
					DEFAULT: 'var(--color-danger-default)',
					strong: 'var(--color-danger-strong)',
					medium: 'var(--color-danger-medium)',
					weak: 'var(--color-danger-weak)',
					contrast: 'var(--color-danger-contrast)'
				},
				warning: {
					DEFAULT: 'var(--color-warning-default)',
					strong: 'var(--color-warning-strong)',
					medium: 'var(--color-warning-medium)',
					weak: 'var(--color-warning-weak)',
					contrast: 'var(--color-warning-contrast)'
				},
				info: {
					DEFAULT: 'var(--color-info-default)',
					strong: 'var(--color-info-strong)',
					medium: 'var(--color-info-medium)',
					weak: 'var(--color-info-weak)',
					contrast: 'var(--color-info-contrast)'
				},
				theme: {
					DEFAULT: 'var(--color-theme-default)',
					strong: 'var(--color-theme-strong)',
					medium: 'var(--color-theme-medium)',
					weak: 'var(--color-theme-weak)',
					contrast: 'var(--color-theme-contrast)'
				}
			}
		}
	},
	plugins: [],
	darkMode: 'class'
} satisfies Config;
