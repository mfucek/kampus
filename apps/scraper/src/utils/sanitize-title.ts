export const sanitizeTitle = (title: string | undefined | null) => {
	if (!title) {
		return '';
	}

	let sanitized = title.trim();

	// remove all double spaces
	// e.g. "Povijest  i geografija" -> "Povijest i geografija"
	sanitized = sanitized.replace(/\s+/g, ' ').trim();

	// remove global parentheses
	if (sanitized.startsWith('(') && sanitized.endsWith(')')) {
		sanitized = sanitized.slice(1, -1);
	}

	// If title contains ;, split it into main title and annotation in parentheses
	// e.g. "Povijest i geografija; smjer: nastavnički" -> "Povijest i geografija (nastavnički)"
	if (sanitized.includes('; ')) {
		const mainTitle = sanitized.split('; ')[0];
		const annotation = sanitized.split('; ')[1].split(': ').reverse().join(' ');
		sanitized = `${mainTitle} (${annotation})`;
	}

	// capitalize first letter of each word unless it's in this list
	const exceptions = [
		'od',
		'do',
		'iz',
		's',
		'sa',
		'ispred',
		'iza',
		'izvan',
		'van',
		'unutar',
		'iznad',
		'ispod',
		'više',
		'poviše',
		'niže',
		'prije',
		'uoči',
		'poslije',
		'nakon',
		'za',
		'tijekom',
		'tokom',
		'podno',
		'nadno',
		'odno',
		'po',
		'nad',
		'na',
		'no',
		'vrh',
		'povrh',
		'navrh',
		'uvrh',
		'zavrh',
		'čelo',
		'nakraj',
		'onkraj',
		'krajem',
		'potkraj',
		'sred',
		'nasred',
		'posred',
		'usred',
		'oko',
		'okolo',
		'blizu',
		'kod',
		'kraj',
		'pokraj',
		'pored',
		'nadomak',
		'nadohvat',
		'i',
		'u',
		'mimo',
		'duž',
		'uzduž',
		'širom',
		'diljem',
		'preko',
		'bez',
		'osim',
		'mjesto',
		'umjesto',
		'namjesto',
		'uime',
		'putem',
		'pomoću',
		'posredstvom',
		'između',
		'spram',
		'naspram',
		'put',
		'protiv',
		'nasuprot',
		'usuprot',
		'usprkos',
		'unatoč',
		'zbog',
		'zbog',
		'radi',
		'zaradi',
		'poradi',
		'glede',
		'prigodom',
		'prilikom',
		'povodom',
		'k',
		'ka',
		'prema',
		'naprama',
		'nadomak',
		'nadohvat',
		'nasuprot',
		'usuprot',
		'usprkos',
		'unatoč',
		'protiv',
		'kroz',
		'niz',
		'uz',
		'na',
		'o',
		'po',
		'u',
		'mimo',
		'među',
		'nad',
		'pod',
		'pred',
		'za',
		'na',
		'o',
		'po',
		'prema',
		'pri',
		'u',
		's',
		'sa',
		'pred',
		'za',
		'nada',
		'nad',
		'poda',
		'pod',
		'među',
		'on',
		'in',
		'beside',
		'above',
		'below',
		'out of',
		'next to',
		'in',
		'on',
		'at',
		'before',
		'to',
		'since',
		'to',
		'toward',
		'into',
		'through',
		'by',
		'with',
		'by',
		'with',
		'on',
		'of',
		'to'
	];
	sanitized = sanitized
		.split(' ')
		.map((word) => {
			// split word into chunks of alphanumerics and non-alphanumerics
			// asd123 => "asd123"
			// asd(123) => "asd", "(", "123", ")"
			// (asd) => "(", "asd", ")"
			// čćšđž => "čćšđž"
			const wordChunks = word.match(
				/[a-zA-Z0-9čćšđžČĆŠĐŽ]+|[^a-zA-Z0-9čćšđžČĆŠĐŽ]+/g
			) || [word];

			const assembledWord = wordChunks.map((chunk) => {
				return exceptions.includes(chunk)
					? chunk
					: chunk.charAt(0).toUpperCase() + chunk.slice(1);
			});
			return assembledWord.join('');
		})
		.join(' ');

	return sanitized;
};
