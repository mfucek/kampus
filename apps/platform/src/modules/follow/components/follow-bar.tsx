'use client';

import { type FC } from 'react';

import { api } from '@/deps/trpc/react';
import { useViewportSize } from '@/deps/viewport-size';
import { Icon } from '@/global/components/icon';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';

// 2812 -> 2.8k
const formatNumber = (number: number) => {
	if (number >= 1000000) {
		return `${(number / 1000000).toFixed(1)}M`;
	}
	if (number >= 1000) {
		return `${(number / 1000).toFixed(1)}k`;
	}
	return number.toString();
};

export const FollowTopicBar: FC<{ topicId: string }> = ({ topicId }) => {
	const { isMobile } = useViewportSize();

	const followQuery = api.follow.getByTopicId.useQuery({ topicId });
	const createFollowMutation = api.follow.create.useMutation();
	const deactivateFollowMutation = api.follow.deactivate.useMutation();
	const utils = api.useUtils();

	const totalFollows = followQuery.data?.totalFollows ?? 0;
	const activeFollows = followQuery.data?.activeFollows ?? 0;
	const isFollowing = followQuery.data?.isFollowing ?? false;

	const handleCreateFollow = async () => {
		await createFollowMutation.mutateAsync({ topicId });
		utils.follow.getByTopicId.invalidate({ topicId });
		utils.follow.listFollowedTopics.invalidate();
	};

	const handleDeactivateFollow = async () => {
		await deactivateFollowMutation.mutateAsync({ topicId });
		utils.follow.getByTopicId.invalidate({ topicId });
		utils.follow.listFollowedTopics.invalidate();
	};

	return (
		<ContentPadding size="lg" className={cn(isMobile && 'pl-0')}>
			<div className="flex flex-row items-center justify-between">
				<div className="flex flex-row gap-3 items-center">
					<div className="flex flex-row gap-2 items-center">
						<div className="flex items-center justify-center w-6 h-6 rounded-lg bg-neutral-weak">
							<Icon icon="visible" className="bg-neutral-strong" size={16} />
						</div>
						<span className="caption text-neutral-strong">
							{formatNumber(totalFollows)}
						</span>
					</div>

					<div className="flex flex-row gap-2 items-center">
						<div className="flex items-center justify-center w-6 h-6 rounded-lg bg-neutral-weak">
							<Icon icon="users" className="bg-neutral-strong" size={16} />
						</div>
						<span className="caption text-neutral-strong">
							{formatNumber(activeFollows)}
						</span>
					</div>
				</div>

				{isFollowing && (
					<Button variant="solid" size="sm" onClick={handleDeactivateFollow}>
						Pratis
						<Icon icon="checkmark" />
					</Button>
				)}
				{!isFollowing && (
					<Button variant="solid-weak" size="sm" onClick={handleCreateFollow}>
						Zaprati
						<Icon icon="add" />
					</Button>
				)}
			</div>
		</ContentPadding>
	);
};
