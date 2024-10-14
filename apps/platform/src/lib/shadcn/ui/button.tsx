import { cn } from '@/lib/shadcn/utils';
import { Spinner } from '@/modules/global/components/spinner';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background duration-300 hover:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:opacity-50',
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
				solid: 'bg-theme text-theme-contrast hover:bg-theme-strong',
				'solid-weak': 'bg-theme-weak text-theme hover:bg-theme-medium',
				outline: 'border border-theme-medium text-theme hover:bg-theme-medium',
				'outline-weak':
					'border border-theme-weak text-theme-strong hover:bg-theme-medium hover:text-theme',
				ghost: 'text-theme hover:bg-theme-weak',
				'ghost-weak': 'text-theme-strong hover:text-theme hover:bg-neutral-weak'
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
				true: 'rounded-full',
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
			}
		]
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			loading,
			iconOnly,
			asChild = false,
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(
					buttonVariants({ variant, size, loading, iconOnly, className })
				)}
				ref={ref}
				{...props}
			>
				{loading && (
					<div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
						<Spinner
							white={['destructive', 'default'].includes(variant || 'default')}
						/>
					</div>
				)}
				{children}
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
