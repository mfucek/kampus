'use client';

import { type FC, useState } from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';

import { cn } from '@/lib/shadcn/utils';

export const ResizeHandle: FC<{
	willCollapse?: boolean;
	onDragStart?: () => void;
	onDragEnd?: () => void;
}> = ({ willCollapse, onDragStart, onDragEnd }) => {
	const [dragging, setDragging] = useState(false);

	return (
		<PanelResizeHandle
			onDragging={(isDragging) => {
				setDragging(isDragging);

				if (isDragging) {
					onDragStart?.();
				} else {
					onDragEnd?.();
				}
			}}
			className={cn(
				'w-2 h-full py-3',
				'duration-100 relative flex justify-center items-center group'
			)}
		>
			<div
				className={cn(
					'bg-neutral-medium duration-100 rounded-full',
					'h-[120px] w-[3px] group-hover:h-[200px] group-hover:bg-neutral-strong',
					dragging && cn('!h-full', willCollapse ? '!bg-danger' : '!bg-accent')
				)}
			/>
		</PanelResizeHandle>
	);
};
