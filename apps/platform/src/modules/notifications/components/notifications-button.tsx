'use client';

import { api } from '@/deps/trpc/react';
import { useViewportSize } from '@/deps/viewport-size';
import { Icon } from '@/global/components/icon';
import { Badge } from '@/lib/shadcn/ui/badge';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/lib/shadcn/ui/dialog';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/lib/shadcn/ui/popover';
import { useState } from 'react';
import { NotificationsList } from './notifications-list';

export const NotificationsButton = () => {
	const { isMobile } = useViewportSize();
	const notificationsQuery = api.notification.list.useQuery();

	const count = notificationsQuery.data?.length ?? 0;

	const [open, setOpen] = useState(false);

	const Action = () => (
		<Button
			size="sm"
			variant="ghost"
			iconOnly
			onClick={(e) => {
				e.stopPropagation();
				setOpen((prev) => !prev);
			}}
		>
			<Icon icon="bell" />
			{count > 0 && (
				<div className="absolute right-0 top-0">
					<Badge size="sm">{count}</Badge>
				</div>
			)}
		</Button>
	);

	if (isMobile) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Action />
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Notifications</DialogTitle>
						<DialogDescription>Notifications</DialogDescription>
					</DialogHeader>
					<NotificationsList />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<>
			<div>
				<Action />
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger className="w-0 h-0 overflow-hidden">
						&nbsp;
					</PopoverTrigger>
					<PopoverContent className="w-[320px]">
						<NotificationsList />
					</PopoverContent>
				</Popover>
			</div>
		</>
	);
};
