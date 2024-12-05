'use client';
import { cn } from '@/lib/shadcn/utils';
import type { FC, HTMLAttributes } from 'react';

export const Divider: FC<HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => {
	return (
		<div className={cn('h-4 w-px bg-neutral-medium', className)} {...props} />
	);
};
