import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { useEffect, useState } from 'react';

const MAX_CHARACTERS = 2000;

export const Composer = () => {
	const [remaining, setRemaining] = useState(MAX_CHARACTERS);
	const [value, setValue] = useState('');

	useEffect(() => {
		setRemaining(MAX_CHARACTERS - value.length);
	}, [value]);

	const Toolbar = () => {
		return (
			<div className="flex flex-row gap-3 px-3">
				<div className="flex flex-row gap-2">
					<Button size="xs" theme="neutral" variant="ghost" iconOnly disabled>
						<Icon icon="text-bold" />
					</Button>
					<Button size="xs" theme="neutral" variant="ghost" iconOnly disabled>
						<Icon icon="text-italic" />
					</Button>
					<Button size="xs" theme="neutral" variant="ghost" iconOnly disabled>
						<Icon icon="text-strikethrough" />
					</Button>
				</div>

				<div className="self-stretch w-px bg-neutral-medium my-1" />

				<div className="flex flex-row gap-2">
					<Button size="xs" theme="neutral" variant="ghost" iconOnly disabled>
						<Icon icon="link" />
					</Button>
				</div>

				<div className="self-stretch w-px bg-neutral-medium my-1" />

				<div className="flex flex-row gap-2">
					<Button size="xs" theme="neutral" variant="ghost" iconOnly disabled>
						<Icon icon="image" />
					</Button>
					<Button size="xs" theme="neutral" variant="ghost" iconOnly disabled>
						<Icon icon="file" />
					</Button>
				</div>

				<div className="self-stretch w-px bg-neutral-medium my-1" />

				<div className="flex flex-row gap-2">
					<Button size="xs" theme="neutral" variant="ghost" iconOnly disabled>
						<Icon icon="ellipsis" />
					</Button>
				</div>
			</div>
		);
	};

	const Footer = () => {
		return (
			<div className="flex flex-row gap-2 items-center">
				<p
					className={cn('w-full text-neutral-strong body-3', {
						'text-danger': remaining < 0
					})}
				>
					{remaining} znakova preostalo.
				</p>
				<Button
					theme="accent"
					variant="solid"
					size="sm"
					disabled={remaining < 0}
				>
					Objavi
				</Button>
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-3 pt-3 border border-neutral-medium rounded-lg overflow-hidden">
				<Toolbar />
				<textarea
					className="input w-full px-3 pb-3"
					placeholder="Napisi komentar ovdje."
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
			</div>
			<Footer />
		</div>
	);
};
