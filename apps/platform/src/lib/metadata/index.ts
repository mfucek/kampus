import { isLocal, isProduction, isStaging } from '@/lib/environment';
import { type Metadata } from 'next';

let faviconUrl = '/favicon.png';

if (isStaging) {
	if (isLocal) {
		faviconUrl = '/favicon-stg-local.png';
	} else {
		faviconUrl = '/favicon-stg.png';
	}
}

if (isProduction) {
	if (isLocal) {
		faviconUrl = '/favicon-prod-local.png';
	} else {
		faviconUrl = '/favicon-prod.png';
	}
}

export const metadata: Metadata = {
	title: 'Kampus.hr | Platforma za sve studente',
	description:
		'Kampus.hr je mjesto za diskusije, dijeljenje materijala i povezivanje s kolegama.',
	icons: [{ rel: 'icon', url: faviconUrl }],
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
