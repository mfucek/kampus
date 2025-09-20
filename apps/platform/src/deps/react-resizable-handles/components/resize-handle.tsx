'use client';

import { type FC, useState } from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';

import { cn } from '@/lib/shadcn/utils';
import { usePostId } from '@/modules/discussion/discussion-panel/components/post-id-provider';

type ResizeHandleProps = {
	horizontal?: boolean;
	vertical?: boolean;
	willCollapse?: boolean;
};

export const ResizeHandle: FC<ResizeHandleProps> = ({
	horizontal,
	vertical,
	willCollapse
}) => {
	const [dragging, setDragging] = useState(false);
	const { setPostId } = usePostId();

	return (
		<PanelResizeHandle
			onDragging={(isDragging) => {
				setDragging(isDragging);
				if (!isDragging) {
					if (willCollapse) {
						setPostId(null);
					}
				}
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
					horizontal &&
						dragging &&
						cn('!w-full', willCollapse ? '!bg-danger' : '!bg-accent'),
					vertical &&
						dragging &&
						cn('!h-full', willCollapse ? '!bg-danger' : '!bg-accent')
				)}
			/>
		</PanelResizeHandle>
	);
};
