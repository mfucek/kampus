import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Kampus.hr',
		short_name: 'Kampus',
		description:
			'Tvoj virtualni kampus za razmjenu znanja, iskustava i materijala. Spojimo sve studente u Hrvatskoj!',
		start_url: '/',
		display: 'standalone',
		orientation: 'portrait',
		theme_color: '#101213',
		background_color: '#000000',
		icons: [
			{
				src: '/favicon.png',
				sizes: '512x512',
				type: 'image/png'
			}
		]
	};
}
