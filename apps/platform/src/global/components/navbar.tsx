'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { ThemeToggler } from '@/modules/theme/components/theme-toggler';
import { useTranslation } from '@/utils/translations/use-translation';
import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export const Navbar = () => {
	const { t } = useTranslation('hr');
	const { isSignedIn, signOut } = useAuth();
	const { openSignIn } = useClerk();

	const handleSignOut = () => {
		signOut();
	};

	const router = useRouter();
	const collegeSlug = useParams().collegeSlug;

	const Actions = () => {
		if (isSignedIn) {
			return (
				<>
					<ThemeToggler />
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
					<div className="title-3">Referada.hr</div>
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
