'use client';
import { Spinner } from './spinner';

import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { useEffect, useState } from 'react';
import { ContentPadding } from '../layouts/content-padding';

export const SpinnerReloadErrorMessage = () => {
	const [showMessage, setShowMessage] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setShowMessage(true);
		}, 3000);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<ContentPadding>
			<div
				className={cn(
					'flex flex-col gap-4 items-center',
					'duration-1000',
					!showMessage && 'translate-y-[calc(50%-20px)]',
					showMessage && 'translate-y-0'
				)}
			>
				<Spinner className="w-10 h-10" />
				<p
					className={cn(
						'body-2 duration-700 text-center',
						!showMessage && 'opacity-0',
						showMessage && 'opacity-100'
					)}
				>
					Učitavanje malo dugo traje, probaj osvježiti stranicu.
				</p>
				<div
					className={cn(
						'duration-700 delay-300',
						!showMessage && 'opacity-0',
						showMessage && 'opacity-100'
					)}
				>
					<Button
						theme="accent"
						size="md"
						onClick={() => window.location.reload()}
					>
						Osvježi stranicu
					</Button>
				</div>
			</div>
		</ContentPadding>
	);
};
