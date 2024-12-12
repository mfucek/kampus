'use client';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';

export const ReadMoreSection = () => {
	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<section className="flex flex-col gap-2 items-center">
			<Button
				onClick={() => scrollToSection('features')}
				variant="outline"
				theme="accent"
				size="lg"
				rounded
			>
				Saznaj više
				<Icon icon="chevron-down" />
			</Button>
		</section>
	);
};
