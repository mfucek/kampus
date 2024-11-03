'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { type FC, type PropsWithChildren } from 'react';

import { env } from '@/env';
import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import { feedbackFormURL } from '@/modules/feedback/constants';
import { NotificationsButton } from '@/modules/notifications/components/notifications-button';
import { ThemeToggler } from '@/modules/theme/components/theme-toggler';
import { Icon } from './icon';

const isStaging = env.NEXT_PUBLIC_DEPLOYMENT === 'staging';

const Divider = () => {
	return <div className="h-4 w-px bg-neutral-medium" />;
};

const ActionsGroup: FC<PropsWithChildren> = ({ children }) => {
	return <div className="flex flex-row gap-2 items-center">{children}</div>;
};

export const Navbar = () => {
	const { isSignedIn } = useAuth();
	const { openSignIn } = useClerk();

	const collegeSlug = useParams().collegeSlug;
	const { data: profilePictureUrl } =
		api.account.getCurrentUserProfilePictureUrl.useQuery();

	const Actions = () => {
		if (isSignedIn) {
			return (
				<>
					<ActionsGroup>
						<Button size="sm" variant="solid-weak" theme="accent">
							Podrzi nas
						</Button>
						<a
							href={feedbackFormURL}
							className="hidden md:block"
							target="_blank"
							rel="noopener norefferer"
						>
							<Button size="sm" variant="solid-weak">
								Feedback
								<Icon icon="help" />
							</Button>
						</a>
					</ActionsGroup>
					<Divider />
					<ActionsGroup>
						<ThemeToggler size="sm" />
						<NotificationsButton />
					</ActionsGroup>
					<Divider />
					<Link href="/profile">
						<div className="w-8 h-8 rounded-full border-neutral-weak bg-neutral-weak relative overflow-hidden clickable">
							{profilePictureUrl && (
								<Image
									src={profilePictureUrl}
									alt="User"
									className="object-cover"
									fill
									sizes="80px"
									quality={80}
								/>
							)}
						</div>
					</Link>
				</>
			);
		}

		return (
			<>
				<ThemeToggler />
				<Button
					onClick={() => openSignIn()}
					theme="accent"
					size="md"
					variant="solid"
				>
					Sign In
				</Button>
			</>
		);
	};

	return (
		<div className="bg-section border-b-neutral-weak h-14 border-b flex flex-row justify-between items-center px-2 shrink-0">
			<Link href="/home">
				<div className="flex flex-row gap-2 items-center">
					{isStaging && (
						<div className="title-3">
							Kampus.hr
							<span className="ml-1 px-2 bg-danger text-danger-contrast caption rounded-xl">
								STG
							</span>
						</div>
					)}
					{collegeSlug && (
						<>
							<div className="title-3 text-neutral-strong">/</div>
							<div className="title-3">{collegeSlug}</div>
						</>
					)}
				</div>
			</Link>
			<div className="flex flex-row gap-4 items-center">
				<Actions />
			</div>
		</div>
	);
};
