'use client';

import { Section } from '@/global/components/section';
import { ContentPadding } from '@/global/layouts/content-padding';

export const IntroSection = () => {
	return (
		<ContentPadding>
			<Section
				title="1. Pripremi materijale"
				description="Iz proizvoljnog izvora pronadi sve materijale koje smatras korisnima: skripte, ispite, popise zadataka, itd."
			/>
		</ContentPadding>
	);
};
