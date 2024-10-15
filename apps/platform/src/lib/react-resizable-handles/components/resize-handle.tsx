'use client';

import { cn } from '@/lib/shadcn/utils';
import { FC, useState } from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';

type ResizeHandleProps = {
	horizontal?: boolean;
	vertical?: boolean;
};

export const ResizeHandle: FC<ResizeHandleProps> = ({
	horizontal,
	vertical
}) => {
	const [dragging, setDragging] = useState(false);

	return (
		<PanelResizeHandle
			onDragging={(e) => {
				setDragging(e);
			}}
			className={cn(
				horizontal && 'h-2 w-full px-3',
				vertical && 'w-2 h-full py-3',
				'duration-100 relative flex justify-center items-center group'
			)}
		>
			<div
				className={cn(
					'bg-neutral-medium duration-100 rounded-full',
					horizontal &&
						'w-[120px] h-[3px] group-hover:w-[200px] group-hover:bg-neutral-strong',
					vertical &&
						'h-[120px] w-[3px] group-hover:h-[200px] group-hover:bg-neutral-strong',
					horizontal && dragging && '!w-full !bg-accent',
					vertical && dragging && '!h-full !bg-accent'
				)}
			/>
		</PanelResizeHandle>
	);
};
