import { cva, type VariantProps } from 'class-variance-authority';
import { type FC, type HTMLAttributes } from 'react';

import { cn } from '@/lib/shadcn/utils';

const listLayoutVariants = cva(['flex flex-col gap-10'], {
	variants: {
		size: {
			sm: 'gap-4',
			md: 'gap-6',
			lg: 'gap-10'
		}
	},
	defaultVariants: {
		size: 'lg'
	}
});

export const ListLayout: FC<
	HTMLAttributes<HTMLDivElement> & VariantProps<typeof listLayoutVariants>
> = ({ className, size, ...props }) => {
	return (
		<div className={cn(listLayoutVariants({ size }), className)} {...props} />
	);
};
