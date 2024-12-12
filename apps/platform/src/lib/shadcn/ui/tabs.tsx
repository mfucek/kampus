'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

import { cn } from '@/lib/shadcn/utils';

const Tabs = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
		tabs_id?: string;
	}
>(({ defaultValue, ...props }, ref) => {
	const searchParams = useSearchParams();
	const currentTab = searchParams.get('activeTab') ?? defaultValue;

	return (
		<TabsPrimitive.Root
			ref={ref}
			defaultValue={currentTab}
			// value={currentTab}
			{...props}
		/>
	);
});
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			'inline-flex items-center border-b border-b-neutral-weak w-full overflow-x-auto',
			className
		)}
		{...props}
	/>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, value, ...props }, ref) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const setSearchParams = (value: string) => {
		const params = new URLSearchParams(searchParams);
		params.set('activeTab', value);
		router.push(`?${params.toString()}`);
	};

	return (
		<TabsPrimitive.Trigger
			ref={ref}
			className={cn(
				'inline-flex items-center justify-center whitespace-nowrap px-3 h-8 button-md ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-neutral data-[state=active]:text-neutral border-b border-b-transparent data-[state=active]:border-b-accent text-neutral-strong relative',
				className
			)}
			value={value}
			onClick={() => {
				setSearchParams(value);
			}}
			{...props}
		>
			<div className="absolute h-[2px] left-0 right-0 bottom-0 bg-transparent data-[state=active]:bg-accent" />
			{children}
		</TabsPrimitive.Trigger>
	);
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			'mt-10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			className
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
