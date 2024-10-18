'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { useTranslation } from '@/utils/translations/use-translation';
import Link from 'next/link';

export const Navbar = () => {
	const { t } = useTranslation('hr');

	const isLoggedIn = true;

	const Nav = () => {
		const scrollToSection = (id: string) => {
			const element = document.getElementById(id);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		};

		return (
			<nav className="flex gap-4 sm:gap-6">
				<a
					className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
					onClick={() => scrollToSection('features')}
				>
					Značajke
				</a>
				<a
					className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
					onClick={() => scrollToSection('how-it-works')}
				>
					Kako radi
				</a>
				<a
					className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
					onClick={() => scrollToSection('pricing')}
				>
					Cijena
				</a>
				<a
					className="text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
					onClick={() => scrollToSection('faq')}
				>
					FAQ
				</a>
			</nav>
		);
	};

	const Actions = () => {
		if (isLoggedIn) {
			return (
				<Link href="/home">
					<Button theme="accent" size="md" variant="solid">
						{t.goToPlatform}
					</Button>
				</Link>
			);
		}

		return (
			<Link href="/register">
				<Button theme="accent" size="md" variant="solid-weak">
					{t.register}
				</Button>
			</Link>
		);
	};

	return (
		<div className="bg-section border-b-neutral-weak h-14 border-b flex flex-row justify-between items-center px-2">
			<div className="title-3">Kampus.hr</div>
			<div className="flex flex-row gap-4 items-center">
				<Nav />
				<Actions />
			</div>
		</div>
	);
};
