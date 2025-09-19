'use client';

import { Badge } from '@/lib/shadcn/ui/badge';
import { Button } from '@/lib/shadcn/ui/button';
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

	// const { isMobile } = useViewportSize();

	return (
		<div className="flex flex-row gap-2 items-center">
			<div className="flex-1 flex flex-row gap-2 items-center">
				{/* <Button variant="solid-weak" theme="accent" size="xs">
					{isMobile ? 'Smjernice' : 'Smjernice za objave'}
					<Icon icon="arrow-linked" />
				</Button> */}
				{isSignedIn && (
					<Badge
						size="lg"
						variant={remaining < 0 ? 'secondary' : 'tertiary'}
						theme={remaining < 0 ? 'danger' : 'neutral'}
					>
						{remaining} znakova preostalo.
					</Badge>
				)}
			</div>
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
