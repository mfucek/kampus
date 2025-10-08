'use client';
import { Icon } from '@/global/components/icon';
import { cn } from '@/lib/shadcn/utils';

export const PanelCloseWarning = ({
	willCollapse
}: {
	willCollapse: boolean;
}) => {
	return (
		<div
			className={cn(
				'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100 pointer-events-none'
			)}
		>
			<Icon
				size={160}
				className={cn(
					'bg-danger duration-200 pointer-events-none',
					willCollapse ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.2]'
				)}
				icon="close"
			/>
		</div>
	);
};
