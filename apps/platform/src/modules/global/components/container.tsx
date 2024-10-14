import { cn } from '@/lib/shadcn/utils';
import { FC, PropsWithChildren } from 'react';

export const Container: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className
}) => {
	return (
		<div className={cn('w-full max-w-[800px] px-2 md:px-10', className)}>
			{children}
		</div>
	);
};
