'use client';

import { cn } from '@/lib/shadcn/utils';
import React from 'react';

export const Logo: React.FC<{
	className?: string;
}> = ({ className }) => {
	return (
		<div
			className={cn(
				'transition-all ease-in duration-200 shrink-0',
				className ? className : 'bg-neutral'
			)}
			style={{
				height: 20,
				WebkitMaskImage: `url('/assets/graphics/logo.svg')`,
				maskImage: `url('/assets/graphics/logo.svg')`,
				WebkitMaskRepeat: 'no-repeat',
				WebkitMaskSize: 'contain',
				WebkitMaskPosition: 'center center',
				maskRepeat: 'no-repeat'
			}}
		/>
	);
};
