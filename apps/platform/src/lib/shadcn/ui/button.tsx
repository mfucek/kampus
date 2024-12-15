'use client';

import { Spinner } from '@/global/components/spinner';
import { cn } from '@/lib/shadcn/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

export const IconSizeContext = React.createContext<number | undefined>(
	undefined
);
export const IconClassnameContext = React.createContext<string | undefined>(
	undefined
);

const buttonVariants = cva(
	'relative inline-flex items-center justify-center whitespace-nowrap ring-offset-background duration-300 hover:md:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:opacity-50 group-[btn] clickable',
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
				solid:
					'border border-transparent bg-theme text-theme-contrast hover:md:bg-theme-strong',
				'solid-weak':
					'border border-transparent bg-theme-weak text-theme hover:md:bg-theme-medium',
				outline:
					'border border-theme-medium text-theme hover:md:bg-theme-medium',
				'outline-weak':
					'border border-theme-weak text-theme-strong hover:md:bg-theme-medium hover:md:text-theme',
				ghost: 'border border-transparent text-theme hover:md:bg-theme-medium',
				'ghost-weak':
					'border border-transparent text-theme-strong hover:md:text-theme hover:md:bg-neutral-medium'
			},
			size: {
				lg: 'h-[52px] px-[20px] gap-[8px] button-lg',
				md: 'h-[40px] px-[16px] gap-[6px] button-md',
				sm: 'h-[32px] px-[12px] gap-[4px] button-md',
				xs: 'h-[24px] px-[8px] gap-[4px] button-sm'
			},
			loading: {
				true: '!text-transparent',
				false: ''
			},
			iconOnly: {
				true: '',
				false: ''
			},
			rounded: {
				true: '',
				false: ''
			}
		},
		defaultVariants: {
			variant: 'solid',
			size: 'md',
			theme: 'accent',
			loading: false,
			rounded: false,
			iconOnly: false
		},
		compoundVariants: [
			{
				size: 'lg',
				iconOnly: true,
				class: 'h-[52px] w-[52px]'
			},
			{
				size: 'md',
				iconOnly: true,
				class: 'h-[40px] w-[40px]'
			},
			{
				size: 'sm',
				iconOnly: true,
				class: 'h-[32px] w-[32px]'
			},
			{
				size: 'xs',
				iconOnly: true,
				class: 'h-[24px] w-[24px]'
			},
			{
				rounded: false,
				size: 'lg',
				class: 'rounded-[12px]'
			},
			{
				rounded: false,
				size: 'md',
				class: 'rounded-[12px]'
			},
			{
				rounded: false,
				size: 'sm',
				class: 'rounded-[10px]'
			},
			{
				rounded: false,
				size: 'xs',
				class: 'rounded-[8px]'
			},
			{
				rounded: true,
				class: 'rounded-full'
			}
		]
	}
);

export const iconClassVariants = cva('shrink-0', {
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
			solid: 'bg-theme-contrast group-[btn]-hover:md:bg-theme-contrast',
			'solid-weak': 'bg-theme group-[btn]-hover:md:bg-theme',
			outline: 'bg-theme group-[btn]-hover:md:bg-theme-contrast',
			'outline-weak': 'bg-theme-strong group-[btn]-hover:md:bg-theme',
			ghost: 'bg-theme group-[btn]-hover:md:bg-theme',
			'ghost-weak': 'bg-theme-strong group-[btn]-hover:md:bg-theme'
		}
	},
	compoundVariants: [
		{
			variant: [
				'solid',
				'solid-weak',
				'outline',
				'outline-weak',
				'ghost',
				'ghost-weak'
			],
			class: 'group-active:opacity-50'
		}
	],
	defaultVariants: {
		variant: 'solid',
		theme: 'accent'
	}
});

export const iconSizeVariants = cva('', {
	variants: {
		size: {
			lg: '',
			md: '',
			sm: '',
			xs: ''
		},
		iconOnly: {
			true: '',
			false: ''
		}
	},
	compoundVariants: [
		{
			size: 'lg',
			class: '24'
		},
		{
			size: 'md',
			iconOnly: false,
			class: '16'
		},
		{
			size: 'md',
			iconOnly: true,
			class: '24'
		},
		{
			size: 'sm',
			iconOnly: false,
			class: '16'
		},
		{
			size: 'sm',
			iconOnly: true,
			class: '20'
		},
		{
			size: 'xs',
			iconOnly: false,
			class: '12'
		},
		{
			size: 'xs',
			iconOnly: true,
			class: '16'
		}
	]
});

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = 'solid',
			size = 'md',
			loading,
			iconOnly,
			asChild = false,
			children,
			theme = 'neutral',
			rounded,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(
					buttonVariants({
						variant,
						size,
						loading,
						iconOnly,
						theme,
						rounded,
						className
					}),
					rounded && 'rounded-full',
					'group'
				)}
				ref={ref}
				{...props}
			>
				{loading && (
					<div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
						<Spinner white />
					</div>
				)}
				<IconSizeContext.Provider
					value={Number(
						iconSizeVariants({ size, iconOnly: iconOnly ?? false })
					)}
				>
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

Button.displayName = 'Button';

export { Button, buttonVariants };
