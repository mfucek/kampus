'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type FC, type PropsWithChildren } from 'react';

import { useAuth } from '@/deps/better-auth/use-auth';
import { api } from '@/deps/trpc/react';
import { Icon, type IconName } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { type ListFollowedTopicsItem } from '@/modules/follow/api/procedures/list-followed-topics';
import { type TopicType } from '@prisma/client';

const removeFromPathname = (pathname: string) => {
	const stringsToRemove = [
		'/all-subjects',
		'/all-staff',
		'/programs',
		'/mass-upload',
		'/materials',
		'/staff'
	];

	// Get the last part of the path
	const parts = pathname.split('/');
	const lastPart = parts[parts.length - 1] || '';
	// Check if the last part matches any of the stringsToRemove (without leading slash)
	const shouldRemove = stringsToRemove.some(
		(str) => str.replace(/^\//, '') === lastPart
	);

	if (shouldRemove) {
		// Remove the last part
		return parts.slice(0, -1).join('/') || '/';
	}
	return pathname;
};

const topicTypeToIcon = (type: TopicType) => {
	if (type === 'COLLEGE') {
		return 'education';
	}
	if (type === 'PROGRAM') {
		return 'file-textual';
	}
	if (type === 'SUBJECT') {
		return 'book-open';
	}
	if (type === 'STAFF') {
		return 'user';
	}
	return 'chat-single';
};

const BookmarkItem: FC<{
	icon: IconName;
	title: string;
	link: string;
}> = ({ icon, title, link }) => {
	const pathname = usePathname();

	const isActive = removeFromPathname(pathname) == link;

	return (
		<Link href={link}>
			<Button
				variant={isActive ? 'outline' : 'ghost-weak'}
				theme={isActive ? 'neutral' : 'neutral'}
				size="sm"
				className="w-full justify-start px-2"
			>
				<div className="flex items-center justify-center w-6 h-6 rounded-lg bg-neutral-weak shrink-0">
					<Icon icon={icon} size={12} />
				</div>
				<span className="truncate">{title}</span>
			</Button>
		</Link>
	);
};

const FollowedTopicBookmarkItem: FC<{
	topic: ListFollowedTopicsItem;
	iconOverride?: IconName;
}> = ({ topic, iconOverride }) => {
	const pathname = usePathname();

	const isActive = removeFromPathname(pathname) == topic.link;

	return (
		<BookmarkItem
			icon={iconOverride ?? topicTypeToIcon(topic.topic.type)}
			title={topic.topic.name}
			link={topic.link}
		/>
	);
};

const BookmarksSection: FC<
	{
		title?: string;
	} & PropsWithChildren
> = ({ title, children }) => {
	return (
		<div className="flex flex-col w-full px-2 py-6 border-b border-background">
			{title && (
				<div className="px-2 mb-3">
					<p className="caption text-neutral">{title}</p>
				</div>
			)}

			{children}
		</div>
	);
};

export const BookmarksContent = () => {
	const { isSignedIn } = useAuth();

	const collegesQuery = api.topic.college.listAll.useQuery();
	const followedTopicsQuery = api.follow.listFollowedTopics.useQuery(void {}, {
		enabled: !!isSignedIn
	});

	return (
		<div className="flex flex-col w-full">
			<BookmarksSection>
				<BookmarkItem icon="home" title="Početna" link="/" />
				<BookmarkItem icon="layout-mosaic" title="Otkrij" link="/expore" />
			</BookmarksSection>

			<BookmarksSection title="Fakulteti">
				{collegesQuery.data?.colleges.map((college) => (
					<BookmarkItem
						key={college.topic.id}
						icon="education"
						title={college.topic.name}
						link={college.link}
					/>
				))}
			</BookmarksSection>

			{isSignedIn && (
				<BookmarksSection title="Following">
					{followedTopicsQuery.data?.topics.map((topic) => (
						<FollowedTopicBookmarkItem key={topic.topic.id} topic={topic} />
					))}
				</BookmarksSection>
			)}
		</div>
	);
};
