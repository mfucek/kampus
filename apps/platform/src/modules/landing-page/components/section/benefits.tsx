import { Container } from '@/global/components/container';

export const BenefitsSection = () => {
	return (
		<section id="how-it-works" className="py-20 flex flex-col items-center">
			<Container>
				<h2 className="display-2 text-center mb-12">Kako radi Kampus.hr?</h2>
				<div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
					<div className="flex flex-col items-center text-center">
						<div className="flex flex-row md:flex-col items-center text-center mb-2 gap-2">
							<div className="md:display-3 title-2">1.</div>
							<h3 className="title-2 font-bold mb">Odaberi svoj faks</h3>
						</div>
						<p>Pronađi forum svog fakulteta i pridruži se raspravama.</p>
					</div>

					<div className="flex flex-col items-center text-center">
						<div className="flex flex-row md:flex-col items-center text-center mb-2 gap-2">
							<div className="md:display-3 title-2">2.</div>
							<h3 className="title-2 font-bold mb">Sudjeluj u raspravama</h3>
						</div>
						<p>
							Postavljaj pitanja, odgovaraj drugima i dijeli svoja iskustva.
						</p>
					</div>

					<div className="flex flex-col items-center text-center">
						<div className="flex flex-row md:flex-col items-center text-center mb-2 gap-2">
							<div className="md:display-3 title-2">3.</div>
							<h3 className="title-2 font-bold mb">
								Dijeli i preuzimaj materijale
							</h3>
						</div>
						<p>Pomozi kolegama dijeljenjem korisnih materijala za učenje.</p>
					</div>
				</div>
			</Container>
		</section>
	);
};
