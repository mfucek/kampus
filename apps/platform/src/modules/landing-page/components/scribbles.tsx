import { type FC } from 'react';

import { cn } from '@/lib/shadcn/utils';

export const Scribbles: FC<{ className?: string }> = ({ className }) => {
	return (
		<div
			className={cn(
				'absolute inset-0 overflow-hidden pointer-events-none',
				className
			)}
		>
			{/* top left */}
			<div
				className={cn(
					'absolute transition-all ease-in duration-200 shrink-0 bg-accent-medium',
					'w-[310px] h-[216px]',
					'scale-[0.4] md:scale-75 lg:scale-100',
					'top-[-20px] left-[-80px]'
				)}
				style={{
					WebkitMaskImage: `url('/assets/illustrations/scribble-stars.svg')`,
					maskImage: `url('/assets/illustrations/scribble-stars.svg')`,
					WebkitMaskRepeat: 'no-repeat',
					WebkitMaskSize: 'contain',
					WebkitMaskPosition: 'center center',
					maskRepeat: 'no-repeat'
				}}
			/>
			{/* top right */}
			<div
				className={cn(
					'absolute transition-all ease-in duration-200 shrink-0 bg-accent-medium',
					'w-[549px] h-[512px]',
					'scale-[0.4] md:scale-75 lg:scale-100',
					'top-[-160px] right-[-240px]'
				)}
				style={{
					WebkitMaskImage: `url('/assets/illustrations/scribble-marks.svg')`,
					maskImage: `url('/assets/illustrations/scribble-marks.svg')`,
					WebkitMaskRepeat: 'no-repeat',
					WebkitMaskSize: 'contain',
					WebkitMaskPosition: 'center center',
					maskRepeat: 'no-repeat'
				}}
			/>
			{/* bottom left */}
			<div
				className={cn(
					'absolute transition-all ease-in duration-200 shrink-0 bg-accent-medium',
					'w-[605px] h-[470px]',
					'scale-[0.4] md:scale-75 lg:scale-100',
					'bottom-[-160px] left-[-240px]'
				)}
				style={{
					WebkitMaskImage: `url('/assets/illustrations/scribble-lines-bl.svg')`,
					maskImage: `url('/assets/illustrations/scribble-lines-bl.svg')`,
					WebkitMaskRepeat: 'no-repeat',
					WebkitMaskSize: 'contain',
					WebkitMaskPosition: 'center center',
					maskRepeat: 'no-repeat'
				}}
			/>
			{/* bottom right */}
			<div
				className={cn(
					'absolute transition-all ease-in duration-200 shrink-0 bg-accent-medium',
					'w-[776px] h-[112px]',
					'scale-[0.4] md:scale-75 lg:scale-100',
					'bottom-[0px] right-[-450px]'
				)}
				style={{
					WebkitMaskImage: `url('/assets/illustrations/scribble-lines-h.svg')`,
					maskImage: `url('/assets/illustrations/scribble-lines-h.svg')`,
					WebkitMaskRepeat: 'no-repeat',
					WebkitMaskSize: 'contain',
					WebkitMaskPosition: 'center center',
					maskRepeat: 'no-repeat'
				}}
			/>
		</div>
	);
};
