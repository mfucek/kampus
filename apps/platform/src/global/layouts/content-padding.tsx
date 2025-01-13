import { cva, type VariantProps } from 'class-variance-authority';
import { type FC, type HTMLAttributes } from 'react';

import { cn } from '@/lib/shadcn/utils';

const contentPaddingVariants = cva('w-full', {
	variants: {
		size: {
			sm: 'px-2 @md:px-0',
			md: 'px-3 @md:px-0',
			lg: 'px-4 @md:px-0'
		}
	},
	defaultVariants: {
		size: 'lg'
	}
});

export const ContentPadding: FC<
	HTMLAttributes<HTMLDivElement> & VariantProps<typeof contentPaddingVariants>
> = ({ className, size, ...props }) => {
	return (
		<div
			className={cn(contentPaddingVariants({ size }), className)}
			{...props}
		/>
	);
};
