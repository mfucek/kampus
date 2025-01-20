import { Container } from '@/global/components/container';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/lib/shadcn/ui/accordion';

export const FaqSection = () => {
	return (
		<section
			id="faq"
			className="py-20 flex flex-col items-center bg-section rounded-2xl md:rounded-3xl"
		>
			<Container>
				<h2 className="display-3 text-center">Često postavljena pitanja</h2>

				<div className="px-3 md:px-6">
					<Accordion type="multiple">
						<AccordionItem value="item-1">
							<AccordionTrigger>Je li Kampus.hr besplatan?</AccordionTrigger>
							<AccordionContent>
								{/* Da, osnovno korištenje Kampus.hr je potpuno besplatan. Premium
								članstvo donosi dodatne pogodnosti, ali nije obavezno. */}
								Da, Kampus je u beta fazi potpuno besplatan. Kasnije će se
								uvesti model pretplate gdje bi se prikazivale reklame pri
								preuzimanju materijala kod besplatanih korisnika.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-2">
							<AccordionTrigger>
								Mogu li koristiti Kampus.hr ako nisam student?
							</AccordionTrigger>
							<AccordionContent>
								Kampus.hr je primarno namijenjen studentima, ali dobrodošli su i
								budući studenti, kao i oni koji su nedavno završili studij.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-3">
							<AccordionTrigger>Kako mogu doprinijeti?</AccordionTrigger>
							<AccordionContent>
								Možeš sudjelovati u raspravama, dijeliti korisne materijale,
								odgovarati na pitanja drugih studenata i dijeliti svoja
								iskustva.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</Container>
		</section>
	);
};
