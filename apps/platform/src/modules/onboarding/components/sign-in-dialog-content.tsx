'use client';

import { useAuth } from '@/deps/better-auth/use-auth';
import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { HeroLogo } from '@/modules/landing-page/components/hero-logo';

export const SignInDialogContent = () => {
	const { signInWithGoogle } = useAuth();

	return (
		<div className="flex flex-col md:flex-row">
			<div className="flex-1 shrink-0 flex flex-col gap-5 items-center justify-center md:py-10">
				<HeroLogo />
				<div className="flex flex-col items-center gap-3">
					<div className="flex flex-row gap-2">
						<Icon icon="checkmark" size={16} />
						<p className="title-3 text-neutral-strong">Sudjeluj u raspravama</p>
					</div>
					<div className="flex flex-row gap-2">
						<Icon icon="checkmark" size={16} />
						<p className="title-3 text-neutral-strong">Reagiraj na komentare</p>
					</div>
					<div className="flex flex-row gap-2">
						<Icon icon="checkmark" size={16} />
						<p className="title-3 text-neutral-strong">
							Poprati teme koje te zanimaju
						</p>
					</div>
					<div className="flex flex-row gap-2">
						<Icon icon="checkmark" size={16} />
						<p className="title-3 text-neutral-strong">
							Preuzimaj javne materijale
						</p>
					</div>
				</div>
			</div>
			<div className="flex-1 shrink-0 flex flex-col gap-2 m-2 bg-section rounded-md items-center justify-center p-4">
				<Button
					variant="solid-weak"
					onClick={() => signInWithGoogle()}
					className="w-full"
					size="lg"
				>
					<img
						src="/assets/illustrations/google.svg"
						alt="Google"
						className="size-5"
					/>
					Sign in with Google
				</Button>
				<Button
					variant="solid-weak"
					onClick={() => signInWithGoogle()}
					className="w-full"
					size="lg"
					disabled
				>
					<img
						src="/assets/illustrations/apple.svg"
						alt="Apple"
						className="size-5 dark:invert"
					/>
					Sign in with Apple
				</Button>
			</div>
		</div>
	);
};
