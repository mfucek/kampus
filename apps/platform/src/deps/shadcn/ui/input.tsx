import * as React from 'react';

import { cn } from '@/lib/shadcn/utils';

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					'flex h-10 w-full rounded-full md:border border-neutral-medium focus:border-neutral-strong bg-section px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-neutral-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 input',
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = 'Input';

export { Input };
