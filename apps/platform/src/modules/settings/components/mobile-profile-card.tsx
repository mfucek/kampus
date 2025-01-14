'use client';

import { Icon } from '@/global/components/icon';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export const MobileProfileCard = () => {
	const { isSignedIn } = useAuth();

	const { data: profilePictureUrl } =
		api.account.getCurrentUserProfilePictureUrl.useQuery(void {}, {
			enabled: !!isSignedIn
		});

	const { data: user } = api.account.getCurrentUser.useQuery();

	return (
		<Link href="/settings/profile">
			<ContentPadding
				size="lg"
				className="flex flex-row md:hidden gap-3 items-center mt-6"
			>
				<div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-neutral-medium">
					<Image
						src={profilePictureUrl ?? '/images/default-profile.png'}
						alt="Profile picture"
						width={48}
						height={48}
						className="object-cover"
					/>
				</div>

				<div className="flex flex-col w-full">
					<p className="title-3 text-neutral">{user?.displayName}</p>
					<p className="caption text-neutral-strong">{'Korisnik'}</p>
					{/* <div className="flex flex-row">
					<p className="caption text-neutral-strong">{'{faks}'}</p>
					<p className="caption text-neutral-medium">{'・'}</p>
					<p className="caption text-neutral-strong">{'{akgod}'}</p>
				</div> */}
				</div>

				<Button variant="ghost" size="lg" iconOnly>
					<Icon icon="edit" />
				</Button>
			</ContentPadding>
		</Link>
	);
};
