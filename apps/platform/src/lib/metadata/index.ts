import { isDevOrStg } from '@/lib/environment';
import { type Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Kampus.hr | Platforma za sve studente',
	description:
		'Kampus.hr je mjesto za diskusije, dijeljenje materijala i povezivanje s kolegama.',
	icons: [
		{ rel: 'icon', url: isDevOrStg ? '/favicon-dev.png' : '/favicon.png' }
	],
	openGraph: {
		title: 'Kampus.hr | Platforma za sve studente',
		description:
			'Kampus.hr je mjesto za diskusije, dijeljenje materijala i povezivanje s kolegama.',
		url: 'https://kampus.hr',
		type: 'website',
		siteName: 'Kampus.hr',
		images: [
			{
				url: 'https://kampus.hr/cover.png',
				width: 1200,
				height: 630
			}
		],
		locale: 'hr-HR'
	}
};
