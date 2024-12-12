import { type FC, type PropsWithChildren } from 'react';

import { cn } from '@/lib/shadcn/utils';

const sizes = {
	sm: 'max-w-[480px]',
	md: 'max-w-[800px]',
	lg: 'max-w-[1200px]',
	xl: 'max-w-[1600px]'
};

export const Container: FC<
	PropsWithChildren<{ className?: string; size?: keyof typeof sizes }>
> = ({ children, className, size = 'md' }) => {
	return (
		<div
			className={cn(
				'w-full @container flex flex-col gap-10',
				sizes[size],
				className
			)}
		>
			{children}
		</div>
	);
};
