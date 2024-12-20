'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { MAX_CHARACTERS } from '@/modules/discussion/constants/composer';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useComposerBodyContext } from '../contexts/composer-body-provider';
import { useSubmitPost } from '../hooks/use-submit-post';

export const ComposerFooter = () => {
	const { handleSubmit, isSubmitting } = useSubmitPost();
	const { characterCount } = useComposerBodyContext();

	const { isSignedIn } = useAuth();
	const { openSignIn } = useClerk();

	const remaining = MAX_CHARACTERS - characterCount;

	return (
		<div className="flex flex-row gap-2 items-center">
			<p
				className={cn('w-full text-neutral-strong body-3', {
					'text-danger': remaining < 0
				})}
			>
				{remaining} znakova preostalo.
			</p>
			{isSignedIn && (
				<Button
					theme="accent"
					variant="solid"
					size="sm"
					disabled={remaining < 0 || characterCount == 0}
					onClick={() => handleSubmit()}
					loading={isSubmitting}
				>
					Objavi
				</Button>
			)}
			{!isSignedIn && (
				<Button
					theme="accent"
					variant="solid"
					size="sm"
					onClick={() => openSignIn()}
				>
					Ulogiraj se
				</Button>
			)}
		</div>
	);
};
