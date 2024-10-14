import { Button } from '@/lib/shadcn/ui/button';
import { useTranslation } from '@/utils/translations/use-translation';
import Link from 'next/link';

export const Navbar = () => {
	const { t } = useTranslation('hr');

	const isLoggedIn = true;

	if (isLoggedIn) {
		return (
			<div className="bg-section border-b-neutral-weak h-14 border-b flex flex-row justify-between items-center px-2">
				<div className="title-3">Kampus.hr</div>
				<div className="flex flex-row gap-2">
					<Link href="/home">
						<Button theme="accent" size="md" variant="solid">
							{t.goToPlatform}
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-section border-b-neutral-weak h-14 border-b flex flex-row justify-between items-center px-2">
			<div className="title-3">Kampus.hr</div>
			<div className="flex flex-row gap-2">
				<Link href="/register">
					<Button theme="accent" size="md" variant="solid-weak">
						{t.register}
					</Button>
				</Link>
				<Link href="/login">
					<Button theme="accent" size="md" variant="solid">
						{t.login}
					</Button>
				</Link>
			</div>
		</div>
	);
};
