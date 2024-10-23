'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { api } from '@/lib/trpc/react';
import { ThemeToggler } from '@/modules/theme/components/theme-toggler';
import { useTranslation } from '@/utils/translations/use-translation';
import { useAuth, useClerk } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export const Navbar = () => {
	const { t } = useTranslation('hr');
	const { isSignedIn, signOut } = useAuth();
	const { openSignIn } = useClerk();

	const handleSignOut = () => {
		signOut();
	};

	const collegeSlug = useParams().collegeSlug;
	const { data: user } = api.account.getUser.useQuery();
	const { data: profilePictureUrl } =
		api.account.getCurrentUserProfilePictureUrl.useQuery();

	const Actions = () => {
		if (isSignedIn) {
			return (
				<>
					<ThemeToggler />
					<Button
						onClick={handleSignOut}
						size="md"
						variant="outline"
						className="hidden md:block"
					>
						Sign Out
					</Button>
					<Link href="/profile">
						<div className="w-10 h-10 rounded-full border-neutral-weak bg-neutral-weak relative overflow-hidden clickable">
							{profilePictureUrl && (
								<Image
									src={profilePictureUrl}
									alt="User"
									objectFit="cover"
									fill
									sizes="80px"
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
					<div className="title-3">Kampus.hr</div>
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
