'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';

import { Icon } from '@/global/components/icon';
import { cn } from '@/lib/shadcn/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import {
	IconClassnameContext,
	iconClassVariants,
	IconSizeContext,
	iconSizeVariants
} from './button';

const selectTriggerVariants = cva(
	'flex items-center justify-between rounded-full border border-theme-medium ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:text-left [&>span>span]:break-all',
	{
		variants: {
			theme: {
				neutral: 'theme-neutral',
				accent: 'theme-accent',
				info: 'theme-info',
				success: 'theme-success',
				warning: 'theme-warning',
				danger: 'theme-danger'
			},
			variant: {
				outline: '',
				'outline-weak': ''
			},
			size: {
				lg: 'h-[52px] px-[20px] gap-[8px] [&>span]:input [&>span>span]:input',
				md: 'h-[40px] px-[16px] gap-[6px] [&>span]:input [&>span>span]:input',
				sm: 'h-[32px] px-[12px] gap-[4px] [&>span]:button-md [&>span>span]:button-md',
				xs: 'h-[24px] px-[12px] gap-[4px] [&>span]:button-sm [&>span>span]:button-sm'
			},
			loading: {
				true: '',
				false: ''
			},
			rounded: {
				true: '',
				false: ''
			}
		},
		defaultVariants: {
			theme: 'neutral',
			variant: 'outline',
			size: 'md',
			loading: false,
			rounded: false
		}
	}
);

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Value>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Value
		ref={ref}
		className={cn(className, 'text-neutral-strong')}
		{...props}
	/>
));
SelectValue.displayName = SelectPrimitive.Value.displayName;

export interface SelectTriggerProps
	extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
		VariantProps<typeof selectTriggerVariants> {}

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	SelectTriggerProps
>(
	(
		{
			className,
			children,
			variant = 'outline',
			loading = false,
			size = 'md',
			theme = 'neutral',
			rounded = false,
			...props
		},
		ref
	) => (
		<SelectPrimitive.Trigger
			ref={ref}
			className={cn(
				selectTriggerVariants({
					variant,
					size,
					loading,
					theme,
					rounded,
					className
				}),
				className
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<IconSizeContext.Provider
					value={Number(iconSizeVariants({ size, iconOnly: false }))}
				>
					<IconClassnameContext.Provider
						value={iconClassVariants({ theme, variant })}
					>
						<Icon icon="chevron-down" />
					</IconClassnameContext.Provider>
				</IconSizeContext.Provider>
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	)
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn(
			'absolute inset-x-0 top-0 flex cursor-default items-center justify-center py-1 bg-gradient-to-b from-foreground to-transparent z-10',
			className
		)}
		{...props}
	>
		<Icon icon="chevron-up" className="bg-neutral h-4 w-4" />
	</SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn(
			'absolute inset-x-0 bottom-0 flex cursor-default items-center justify-center py-1 bg-gradient-to-t from-foreground to-transparent z-10',
			className
		)}
		{...props}
	>
		<Icon icon="chevron-down" className="bg-neutral h-4 w-4" />
	</SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
	SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(
				'relative z-50 max-h-96 max-w-[min(400px,calc(100vw-16px))] min-w-[8rem] overflow-hidden rounded-xl border border-neutral-medium bg-foreground text-neutral data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				position === 'popper' &&
					'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
				className
			)}
			position={position}
			{...props}
		>
			<SelectScrollUpButton />
			<SelectPrimitive.Viewport
				className={cn(
					'p-1',
					position === 'popper' &&
						'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
				)}
			>
				{children}
			</SelectPrimitive.Viewport>
			<SelectScrollDownButton />
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn('py-1.5 pl-8 pr-2', className)}
		{...props}
	/>
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-2 pr-2 outline-none focus:bg-accent-weak focus:text-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className
		)}
		{...props}
	>
		<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Icon icon="checkmark" className="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>

		<SelectPrimitive.ItemText>
			<span className="body-2">{children}</span>
		</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ref}
		className={cn('-mx-1 my-1 h-px bg-neutral-weak', className)}
		{...props}
	/>
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue
};
