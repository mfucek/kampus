export const slugify = (str: string) => {
	// B. Milašinović Jurkin -> b-milasinovic-jurkin
	const lowerCase = str.toLowerCase();
	const noHash = lowerCase.replace(/#/g, '-sharp');
	const noBrackets = noHash.replace(/\(/g, '').replace(/\)/g, '');

	const replacedAccentsWithChars = noBrackets.replace(/[čćšđž]/g, (char) => {
		switch (char) {
			case 'č':
				return 'c';
			case 'ć':
				return 'c';
			case 'š':
				return 's';
			case 'đ':
				return 'd';
			case 'ž':
				return 'z';
			default:
				return '';
		}
	});

	// replace all non-alphanumeric characters with a dash
	const noNonAlphanumeric = replacedAccentsWithChars.replace(
		/[^a-zA-Z0-9]/g,
		'-'
	);

	return noNonAlphanumeric;
};
