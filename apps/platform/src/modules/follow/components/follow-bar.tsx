'use client';

import { type FC } from 'react';

import { useViewportSize } from '@/deps/viewport-size';
import { Icon } from '@/global/components/icon';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';

export const FollowTopicBar: FC<{ topicId: string }> = ({ topicId }) => {
	const { isMobile } = useViewportSize();

	return (
		<ContentPadding size="lg" className={cn(isMobile && 'pl-0')}>
			<div className="flex flex-row items-center justify-between">
				<div className="flex flex-row gap-2 items-center">
					<div className="flex items-center justify-center w-6 h-6 rounded-lg bg-neutral-weak">
						<Icon icon="users" className="bg-neutral-strong" size={16} />
					</div>
					<span className="caption text-neutral-strong">2.8k</span>
				</div>

				<Button variant="solid-weak" size="sm">
					Zaprati
					<Icon icon="add" />
				</Button>
			</div>
		</ContentPadding>
	);
};
