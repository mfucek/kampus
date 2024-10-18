import type { FC } from 'react';
import { Footer } from '../components/footer';
import { BenefitsSection } from '../components/section/benefits';
import { FaqSection } from '../components/section/faq';
import { FeaturesSection } from '../components/section/features';
import { HeroSection } from '../components/section/hero';
import { PricingSection } from '../components/section/pricing';
export const LandingPage: FC = async () => {
	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1">
				<HeroSection />
				<FeaturesSection />
				<BenefitsSection />
				<PricingSection />
				<FaqSection />
			</main>
			<Footer />
		</div>
	);
};
