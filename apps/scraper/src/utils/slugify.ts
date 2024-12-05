export const slugify = (str: string) => {
	// B. Milašinović Jurkin -> b-milasinovic-jurkin
	const lowerCase = str.toLowerCase();
	const noDots = lowerCase.replace(/\./g, '');
	const noSpaces = noDots.replace(/\s+/g, '-');
	const replacedAccentsWithChars = noSpaces.replace(/[čćšđž]/g, (char) => {
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
	return replacedAccentsWithChars;
};
