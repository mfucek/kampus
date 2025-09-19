'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';

import { Icon } from '@/global/components/icon';
import { cn } from '@/lib/shadcn/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item
		ref={ref}
		className={cn(
			'[&:not(:last-child)]:border-b border-b-neutral-weak',
			className
		)}
		{...props}
	/>
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				'flex flex-1 items-center gap-1 py-4 transition-all [&[data-state=open]>div]:rotate-180 title-2 text-left',
				className
			)}
			{...props}
		>
			<Icon icon="chevron-down" className="bg-neutral-strong" size={24} />
			{children}
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className="overflow-hidden body-1 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		{...props}
	>
		<div className={cn('pb-4 pt-0 pl-7', className)}>{children}</div>
	</AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
