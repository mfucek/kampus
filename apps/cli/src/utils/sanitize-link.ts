export const sanitizeLink = (linkOriginal: string, baseUrl: string) => {
	let linkCorrected = linkOriginal;

	if (linkCorrected.includes(' ')) return null;

	// fix protocol (e.g. ttps:// -> https://)
	linkCorrected = linkCorrected.includes('://')
		? 'https://' + linkCorrected.split('://')[1]
		: linkCorrected;

	// www2. -> www.
	linkCorrected = linkCorrected.includes('www2.')
		? linkCorrected.replace('www2.', 'www.')
		: linkCorrected;

	// add base url to relative links
	linkCorrected = linkCorrected.startsWith('/')
		? baseUrl + linkCorrected
		: linkCorrected;

	const isValid = new RegExp(
		'((http|https)://)(www.)?' +
			'[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]' +
			'{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)'
	).test(linkCorrected);

	if (!isValid) return null;

	return linkCorrected;
};

console.log(
	sanitizeLink(
		'ttps://www.ttf.unizg.hr/s-tjelesna-i-zdravstvena-kultura-i/845',
		'https://www.ttf.unizg.hr'
	)
);
console.log(
	sanitizeLink('http://mag. ing. techn. text.', 'https://www.ttf.unizg.hr')
);
