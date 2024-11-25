import type { FC } from 'react';
import { Footer } from '../components/footer';
import { BenefitsSection } from '../components/section/benefits';
import { FaqSection } from '../components/section/faq';
import { FeaturesSection } from '../components/section/features';
import { PricingSection } from '../components/section/pricing';
import { Test } from '../components/test';

export const LandingPage: FC = async () => {
	return (
		<div className="flex flex-col min-h-screen bg-section">
			<main className="flex-1 bg-section">
				<Test />
				{/* <HeroSection /> */}
				<FeaturesSection />
				<BenefitsSection />
				<PricingSection />
				<FaqSection />
			</main>
			<Footer />
		</div>
	);
};
