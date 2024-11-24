'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { useSubmitPost } from '../hooks/use-submit-post';

export const ComposerFooter = () => {
	const { handleSubmit, isSubmitting } = useSubmitPost();

	return (
		<div className="flex flex-row gap-2 items-center">
			<p
				className={cn('w-full text-neutral-strong body-3', {
					// 'text-danger': remaining < 0
				})}
			>
				{'remaining'} znakova preostalo.
			</p>
			<Button
				theme="accent"
				variant="solid"
				size="sm"
				// disabled={remaining < 0 || textValue.length <= 0}
				onClick={handleSubmit}
				loading={isSubmitting}
			>
				Objavi
			</Button>
		</div>
	);
};
