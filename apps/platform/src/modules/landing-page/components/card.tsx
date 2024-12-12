'use client';
import { IconSizeContext } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { HTMLAttributes, type FC } from 'react';

export const Card: FC<HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
	...props
}) => {
	return (
		<div
			className={cn(
				'p-10 rounded-xl bg-section flex flex-col gap-4 justify-between',
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export const CardHeader: FC<HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
	...props
}) => {
	return (
		<div className={cn('flex flex-col gap-2 mb-2', className)} {...props}>
			<IconSizeContext.Provider value={24}>{children}</IconSizeContext.Provider>
		</div>
	);
};

export const CardTitle: FC<HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
	...props
}) => {
	return (
		<div className={cn('flex flex-row gap-2 title-3', className)} {...props}>
			{children}
		</div>
	);
};

export const CardContent: FC<HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
	...props
}) => {
	return (
		<div className={cn('text-neutral-strong', className)} {...props}>
			{children}
		</div>
	);
};
