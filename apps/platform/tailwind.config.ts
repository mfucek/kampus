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
					DEFAULT:
						'rgba(from var(--color-accent-default) r g b / var(--tw-bg-opacity))',
					strong:
						'rgba(from var(--color-accent-strong) r g b / var(--tw-bg-opacity))',
					medium:
						'rgba(from var(--color-accent-medium) r g b / var(--tw-bg-opacity))',
					weak: 'rgba(from var(--color-accent-weak) r g b / var(--tw-bg-opacity))',
					contrast:
						'rgba(from var(--color-accent-contrast) r g b / var(--tw-bg-opacity))'
				},
				neutral: {
					DEFAULT:
						'rgba(from var(--color-neutral-default) r g b / var(--tw-bg-opacity))',
					strong:
						'rgba(from var(--color-neutral-strong) r g b / var(--tw-bg-opacity))',
					medium:
						'rgba(from var(--color-neutral-medium) r g b / var(--tw-bg-opacity))',
					weak: 'rgba(from var(--color-neutral-weak) r g b / var(--tw-bg-opacity))',
					contrast:
						'rgba(from var(--color-neutral-contrast) r g b / var(--tw-bg-opacity))'
				},
				success: {
					DEFAULT:
						'rgba(from var(--color-success-default) r g b / var(--tw-bg-opacity))',
					strong:
						'rgba(from var(--color-success-strong) r g b / var(--tw-bg-opacity))',
					medium:
						'rgba(from var(--color-success-medium) r g b / var(--tw-bg-opacity))',
					weak: 'rgba(from var(--color-success-weak) r g b / var(--tw-bg-opacity))',
					contrast:
						'rgba(from var(--color-success-contrast) r g b / var(--tw-bg-opacity))'
				},
				danger: {
					DEFAULT:
						'rgba(from var(--color-danger-default) r g b / var(--tw-bg-opacity))',
					strong:
						'rgba(from var(--color-danger-strong) r g b / var(--tw-bg-opacity))',
					medium:
						'rgba(from var(--color-danger-medium) r g b / var(--tw-bg-opacity))',
					weak: 'rgba(from var(--color-danger-weak) r g b / var(--tw-bg-opacity))',
					contrast:
						'rgba(from var(--color-danger-contrast) r g b / var(--tw-bg-opacity))'
				},
				warning: {
					DEFAULT:
						'rgba(from var(--color-warning-default) r g b / var(--tw-bg-opacity))',
					strong:
						'rgba(from var(--color-warning-strong) r g b / var(--tw-bg-opacity))',
					medium:
						'rgba(from var(--color-warning-medium) r g b / var(--tw-bg-opacity))',
					weak: 'rgba(from var(--color-warning-weak) r g b / var(--tw-bg-opacity))',
					contrast:
						'rgba(from var(--color-warning-contrast) r g b / var(--tw-bg-opacity))'
				},
				info: {
					DEFAULT:
						'rgba(from var(--color-info-default) r g b / var(--tw-bg-opacity))',
					strong:
						'rgba(from var(--color-info-strong) r g b / var(--tw-bg-opacity))',
					medium:
						'rgba(from var(--color-info-medium) r g b / var(--tw-bg-opacity))',
					weak: 'rgba(from var(--color-info-weak) r g b / var(--tw-bg-opacity))',
					contrast:
						'rgba(from var(--color-info-contrast) r g b / var(--tw-bg-opacity))'
				},
				theme: {
					DEFAULT:
						'rgba(from var(--color-theme-default) r g b / var(--tw-bg-opacity))',
					strong:
						'rgba(from var(--color-theme-strong) r g b / var(--tw-bg-opacity))',
					medium:
						'rgba(from var(--color-theme-medium) r g b / var(--tw-bg-opacity))',
					weak: 'rgba(from var(--color-theme-weak) r g b / var(--tw-bg-opacity))',
					contrast:
						'rgba(from var(--color-theme-contrast) r g b / var(--tw-bg-opacity))'
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
	safelist: [
		'theme-neutral',
		'theme-accent',
		'theme-success',
		'theme-danger',
		'theme-warning',
		'theme-info',
		'input'
	],
	plugins: [
		require('@tailwindcss/container-queries'),
		require('tailwindcss-animate'),
		require('tailwindcss-displaymodes')
	],
	darkMode: ['class']
} satisfies Config;
