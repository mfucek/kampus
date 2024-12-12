import type { FC } from 'react';
import { Footer } from '../components/footer';
import { FaqSection } from '../components/section/faq';
import { FeaturesSection } from '../components/section/features';
import { HeroSection } from '../components/section/hero';
import { PricingSection } from '../components/section/pricing';
import { ReadMoreSection } from '../components/section/read-more';

export const LandingPage: FC = async () => {
	return (
		<div className="flex flex-col min-h-screen bg-background">
			<main className="flex-1">
				<HeroSection />
				<div className="flex flex-col gap-2 px-2 md:px-6">
					<ReadMoreSection />
					<FeaturesSection />
					{/* <BenefitsSection /> */}
					<PricingSection />
					<FaqSection />
				</div>
			</main>
			<Footer />
		</div>
	);
};
