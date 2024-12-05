'use client';
import { cn } from '@/lib/shadcn/utils';
import type { FC, HTMLAttributes } from 'react';

export const ActionsGroup: FC<HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
	...props
}) => {
	return (
		<div
			className={cn('flex flex-row gap-2 items-center', className)}
			{...props}
		>
			{children}
		</div>
	);
};
