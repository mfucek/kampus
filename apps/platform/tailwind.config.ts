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
				section: 'rgba(from var(--color-section) r g b / var(--tw-bg-opacity))',
				background:
					'rgba(from var(--color-background) r g b / var(--tw-bg-opacity))',
				foreground:
					'rgba(from var(--color-foreground) r g b / var(--tw-bg-opacity))',
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
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'push-fade-right': {
					from: {
						opacity: '0',
						transform: 'translateX(-10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateX(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'push-fade-right': 'push-fade-right 0.5s ease-out'
			}
		},
		screens: {
			xs: '400px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px'
		},
		containers: {
			xs: '400px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px'
		}
	},
	plugins: [
		require('@tailwindcss/container-queries'),
		require('tailwindcss-animate')
	],
	darkMode: ['class', 'class']
} satisfies Config;
