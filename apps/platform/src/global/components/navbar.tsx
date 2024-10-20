'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { useTranslation } from '@/utils/translations/use-translation';
import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';

export const Navbar = () => {
	const { t } = useTranslation('hr');
	const { isSignedIn, signOut } = useAuth();
	const { openSignIn } = useClerk();

	const handleSignOut = () => {
		signOut();
	};

	const Actions = () => {
		if (isSignedIn) {
			return (
				<>
					<Link href="/home">
						<Button theme="accent" size="md" variant="solid">
							Profile
						</Button>
					</Link>
					<Button onClick={handleSignOut} size="md" variant="outline">
						Sign Out
					</Button>
				</>
			);
		}

		return (
			<Button
				onClick={() => openSignIn()}
				theme="accent"
				size="md"
				variant="solid"
			>
				Sign In
			</Button>
		);
	};

	return (
		<div className="bg-section border-b-neutral-weak h-14 border-b flex flex-row justify-between items-center px-2 shrink-0">
			<div className="title-3">Kampus.hr</div>
			<div className="flex flex-row gap-4 items-center">
				<Actions />
			</div>
		</div>
	);
};
