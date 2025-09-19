'use client';

import { cn } from '@/lib/shadcn/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

export const IconSizeContext = React.createContext<number | undefined>(
	undefined
);
export const IconClassnameContext = React.createContext<string | undefined>(
	undefined
);

const badgeVariants = cva(
	'relative inline-flex items-center justify-center whitespace-nowrap',
	{
		variants: {
			theme: {
				accent: 'theme-accent',
				neutral: 'theme-neutral',
				info: 'theme-info',
				success: 'theme-success',
				warning: 'theme-warning',
				danger: 'theme-danger'
			},
			variant: {
				primary: 'bg-theme text-theme-contrast',
				secondary: 'bg-theme-weak text-theme',
				tertiary: 'bg-theme-weak text-theme-strong'
			},
			size: {
				lg: 'h-[24px] px-[8px] gap-[2px] rounded-[8px] caption',
				md: 'h-[20px] px-[6px] gap-[2px] rounded-[8px] caption',
				sm: 'h-[12px] px-[4px] gap-[2px] rounded-[8px] overline'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
			theme: 'accent'
		}
	}
);

const iconClassVariants = cva('shrink-0', {
	variants: {
		theme: {
			accent: 'theme-accent',
			neutral: 'theme-neutral',
			info: 'theme-info',
			success: 'theme-success',
			warning: 'theme-warning',
			danger: 'theme-danger'
		},
		variant: {
			primary: 'bg-theme-contrast',
			secondary: 'bg-theme',
			tertiary: 'bg-theme-strong'
		}
	},
	defaultVariants: {
		variant: 'primary',
		theme: 'accent'
	}
});

const iconSizeVariants = cva('', {
	variants: {
		size: {
			lg: '16',
			md: '16',
			sm: '12'
		}
	}
});

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
	(
		{
			className,
			variant = 'primary',
			size = 'md',
			children,
			theme = 'accent',
			...props
		},
		ref
	) => {
		const Comp = 'div';
		return (
			<Comp
				className={cn(
					badgeVariants({
						variant,
						size,
						theme,
						className
					}),
					'group'
				)}
				style={{
					textDecoration: 'none'
				}}
				ref={ref}
				{...props}
			>
				<IconSizeContext.Provider value={Number(iconSizeVariants({ size }))}>
					<IconClassnameContext.Provider
						value={iconClassVariants({ theme, variant })}
					>
						{children}
					</IconClassnameContext.Provider>
				</IconSizeContext.Provider>
			</Comp>
		);
	}
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
