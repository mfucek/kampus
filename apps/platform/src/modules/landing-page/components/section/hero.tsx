import { Container } from '@/global/components/container';
import { Button } from '@/lib/shadcn/ui/button';

export const HeroSection = () => {
	return (
		<section className="flex flex-col items-center py-40" id="hero">
			<Container>
				<div className="flex flex-col items-center space-y-4 text-center">
					<div className="flex flex-col items-center gap-6">
						<h1 className="display-1">Dobrodošli na Kampus.hr</h1>
						<p className="max-w-[640px] text-neutral-strong">
							Tvoj virtualni kampus za razmjenu znanja, iskustava i materijala.
							Spojimo sve studente u Hrvatskoj!
						</p>
					</div>
					<div className="flex flex-row gap-4">
						<Button>Pridruži se besplatno</Button>
						<Button variant="outline">Saznaj više</Button>
					</div>
				</div>
			</Container>
		</section>
	);
};
