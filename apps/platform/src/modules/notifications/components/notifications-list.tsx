'use client';

import { NotificationType } from '@prisma/client';
import Link from 'next/link';
import { type FC, type MouseEventHandler } from 'react';

import { api } from '@/deps/trpc/react';
import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { type NotificationListItem } from '../api/procedures/list';

const typeToLabel = (type: NotificationType, name?: string) => {
	if (type === NotificationType.POST_REPLY) {
		return `${name} je odgovorio na tvoju objavu`;
	}

	return type;
};

const NotificationCard: FC<{ notification: NotificationListItem }> = ({
	notification
}) => {
	const deleteById = api.notification.deleteById.useMutation();

	const utils = api.useUtils();

	const handleDeleteById: MouseEventHandler<HTMLButtonElement> = async (e) => {
		e.stopPropagation();
		await deleteById.mutateAsync({
			notificationId: notification.notification.id
		});
		await utils.notification.list.invalidate();
	};

	return (
		<Link href={notification.reply?.originalPostLink ?? '#'}>
			<div className="flex flex-row gap-3 p-4 bg-section rounded-lg clickable">
				<div className="shrink-0 w-6 h-6 rounded-full bg-neutral-medium" />

				<div className="flex flex-col flex-1">
					<p className="caption text-neutral">
						{typeToLabel(
							notification.notification.type,
							notification.reply?.author.name
						)}
					</p>
					<p className="body-2 text-neutral-strong">
						{notification.reply?.post.body}
					</p>
				</div>

				<Button
					variant="ghost-weak"
					size="xs"
					iconOnly
					onClick={handleDeleteById}
				>
					<Icon icon="trash" />
				</Button>

				{/* {!notification.notification.seen && (
				<div className="w-1 h-1 rounded-full bg-accent" />
				)} */}
			</div>
		</Link>
	);
};

const NoNotifications = () => {
	return (
		<p className="body-1 text-center text-neutral-strong mb-3">
			You're all caught up!
		</p>
	);
};

export const NotificationsList = () => {
	const notificationsQuery = api.notification.list.useQuery();

	const deleteAll = api.notification.deleteAll.useMutation();

	const utils = api.useUtils();

	const handleDeleteAll = async () => {
		await deleteAll.mutateAsync();
		await utils.notification.list.invalidate();
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-row justify-between items-center">
				<p className="title-3 text-neutral">Obavjesti</p>
				<Button
					theme="accent"
					variant="ghost"
					size="sm"
					onClick={handleDeleteAll}
				>
					Očisti
				</Button>
			</div>

			<div className="flex flex-col gap-1">
				{notificationsQuery.data?.map((notification) => (
					<NotificationCard
						key={notification.notification.id}
						notification={notification}
					/>
				))}
			</div>

			{notificationsQuery.data?.length === 0 && <NoNotifications />}
		</div>
	);
};
