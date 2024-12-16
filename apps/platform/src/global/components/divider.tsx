import { cn } from '@/lib/shadcn/utils';
import { type FC, type HTMLAttributes } from 'react';

export const Divider: FC<HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => {
	return (
		<div
			className={cn('w-full h-[1px] bg-neutral-weak', className)}
			{...props}
		/>
	);
};

export const VerticalDivider: FC<HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => {
	return (
		<div
			className={cn('h-full w-[1px] bg-neutral-weak', className)}
			{...props}
		/>
	);
};
