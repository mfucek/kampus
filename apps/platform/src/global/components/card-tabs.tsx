'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { ContentPadding } from '../layouts/content-padding';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<ContentPadding size="sm">
		<TabsPrimitive.List
			ref={ref}
			className={cn(
				'flex flex-row md:grid md:grid-cols-4 gap-2 md:overflow-x-visiblepx-0 overflow-x-auto scrollbar-hidden',
				className
			)}
			{...props}
		/>
	</ContentPadding>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, value, ...props }, ref) => {
	return (
		<TabsPrimitive.Trigger ref={ref} value={value} asChild>
			<Button
				variant={'solid-weak'}
				size="sm"
				className={cn(
					'md:h-16 h-14 sm:flex-1 lg:shrink-0 md:justify-start px-4',
					'whitespace-normal text-neutral',
					'text-center lg:text-left',
					'data-[state=active]:border data-[state=active]:border-theme data-[state=active]:theme-accent data-[state=inactive]:theme-neutral min-w-[120px] md:min-w-none justify-center md:justify-start',
					'data-[state=inactive]:bg-section md:data-[state=inactive]:bg-neutral-weak',
					className
				)}
				{...props}
			>
				{children}
			</Button>
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
			'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
			className
		)}
		{...props}
	/>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
