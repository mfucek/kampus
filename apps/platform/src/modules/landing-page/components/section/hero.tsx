import { Container } from '@/global/components/container';
import { api } from '@/lib/trpc/server';
import { HeroLogo } from '../hero-logo';
import { HeroSearch } from '../hero-search';
import { RadialGrid } from '../radial-grid';
import { Scribbles } from '../scribbles';

export const HeroSection = async () => {
	const [topColleges, allColleges] = await Promise.all([
		api.college.listTopColleges(),
		api.college.listAll()
	]);

	return (
		<section
			className="flex flex-col gap-10 items-center py-40 bg-gradient-to-b from-section to-background relative min-h-none md:min-h-[90vh]"
			id="hero"
		>
			<Container className="z-10">
				<HeroLogo />
			</Container>
			<Container className="z-10">
				<HeroSearch topColleges={topColleges} allColleges={allColleges} />
			</Container>
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<RadialGrid className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 theme-neutral" />
			</div>
			{/* <FloatingColleges allColleges={allColleges} /> */}
			<Scribbles />
		</section>
	);
};
