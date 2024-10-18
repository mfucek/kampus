import { Container } from '@/global/components/container';

export const BenefitsSection = () => {
	return (
		<section id="how-it-works" className="py-20 flex flex-col items-center">
			<Container>
				<h2 className="display-2 text-center mb-12">Kako radi Kampus.hr?</h2>
				<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
					<div className="flex flex-col items-center text-center">
						<div className="mb-4 text-4xl font-bold">1</div>
						<h3 className="text-xl font-bold mb-2">Odaberi svoj faks</h3>
						<p>Pronađi forum svog fakulteta i pridruži se raspravama.</p>
					</div>
					<div className="flex flex-col items-center text-center">
						<div className="mb-4 text-4xl font-bold">2</div>
						<h3 className="text-xl font-bold mb-2">Sudjeluj u raspravama</h3>
						<p>
							Postavljaj pitanja, odgovaraj drugima i dijeli svoja iskustva.
						</p>
					</div>
					<div className="flex flex-col items-center text-center">
						<div className="mb-4 text-4xl font-bold">3</div>
						<h3 className="text-xl font-bold mb-2">
							Dijeli i preuzimaj materijale
						</h3>
						<p>Pomozi kolegama dijeljenjem korisnih materijala za učenje.</p>
					</div>
				</div>
			</Container>
		</section>
	);
};
