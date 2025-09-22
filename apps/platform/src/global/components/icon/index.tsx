'use client';

import React from 'react';

import { IconClassnameContext, IconSizeContext } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { icons } from './icons';

export type IconName = keyof typeof icons;

// export const Icon: React.FC<{
// 	icon: IconName;
// 	className?: string;
// }> = ({ icon, className }) => {
// 	return (
// 		<div
// 			className={cn(
// 				'transition-all ease-in duration-200 shrink-0',
// 				'size-6 bg-neutral',
// 				className
// 			)}
// 			style={{
// 				WebkitMaskImage: `url('${icons[icon]}')`,
// 				maskImage: `url('${icons[icon]}')`,
// 				WebkitMaskRepeat: 'no-repeat',
// 				WebkitMaskSize: 'contain',
// 				WebkitMaskPosition: 'center center',
// 				maskRepeat: 'no-repeat'
// 			}}
// 		/>
// 	);
// };

export const Icon: React.FC<{
	icon: IconName;
	size?: string | number;
	className?: string;
}> = ({ icon, size, className }) => {
	const contextSize = React.useContext(IconSizeContext);
	const iconSize = size ?? contextSize ?? 24;
	const iconClass = React.useContext(IconClassnameContext);

	return (
		<div
			className={cn(
				'transition-all ease-in duration-200 shrink-0',
				className ? className : 'bg-neutral',
				iconClass
			)}
			style={{
				height: iconSize,
				width: iconSize,
				WebkitMaskImage: `url('${icons[icon]}')`,
				maskImage: `url('${icons[icon]}')`,
				WebkitMaskRepeat: 'no-repeat',
				WebkitMaskSize: 'contain',
				WebkitMaskPosition: 'center center',
				maskRepeat: 'no-repeat'
			}}
		/>
	);
};
