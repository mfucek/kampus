import { Button } from '@/lib/shadcn/ui/button';
import { Icon } from '@/modules/global/components/icon';

export const Composer = () => {
	const Toolbar = () => {
		return (
			<div className="flex flex-row gap-3">
				<div className="flex flex-row gap-2">
					<Button size="xs" theme="accent" variant="solid" iconOnly>
						<Icon icon="text-bold" />
					</Button>
					<Button size="xs" theme="neutral" variant="ghost" iconOnly>
						<Icon icon="text-italic" />
					</Button>
					<Button size="xs" theme="neutral" variant="ghost" iconOnly>
						<Icon icon="text-strikethrough" />
					</Button>
				</div>

				<div className="self-stretch w-px bg-neutral-medium my-1" />

				<div className="flex flex-row gap-2">
					<Button size="xs" theme="neutral" variant="ghost" iconOnly>
						<Icon icon="link" />
					</Button>
				</div>

				<div className="self-stretch w-px bg-neutral-medium my-1" />

				<div className="flex flex-row gap-2">
					<Button size="xs" theme="neutral" variant="ghost" iconOnly>
						<Icon icon="image" />
					</Button>
					<Button size="xs" theme="neutral" variant="ghost" iconOnly>
						<Icon icon="file" />
					</Button>
				</div>

				<div className="self-stretch w-px bg-neutral-medium my-1" />

				<div className="flex flex-row gap-2">
					<Button size="xs" theme="neutral" variant="ghost" iconOnly>
						<Icon icon="ellipsis" />
					</Button>
				</div>
			</div>
		);
	};

	const Footer = () => {
		return (
			<div className="flex flex-row gap-2 items-center">
				<p className="w-full text-neutral-strong body-3">
					1789 znakova preostalo.
				</p>
				<Button theme="accent" variant="solid" size="sm">
					Objavi
				</Button>
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="p-3 border border-neutral-medium rounded-lg">
				<Toolbar />
				<input className="w-full" placeholder="Add a comment" />
			</div>
			<Footer />
		</div>
	);
};
