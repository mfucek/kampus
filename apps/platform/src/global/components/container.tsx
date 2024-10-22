import { cn } from '@/lib/shadcn/utils';
import { FC, PropsWithChildren } from 'react';

export const Container: FC<
	PropsWithChildren<{ className?: string; wide?: boolean }>
> = ({ children, className, wide = false }) => {
	return (
		<div
			className={cn(
				'w-full px-2 md:px-10 @container',
				wide ? 'max-w-[1200px]' : 'max-w-[800px]',
				className
			)}
		>
			{children}
		</div>
	);
};
