/**
 * Extracts a clean name from a string that may contain academic titles
 * and job titles.
 *
 * Examples:
 * - "doc. art. Marin Sovar" -> "Marin Sovar"
 * - "prof. dr. sc. Ana Sutlović" -> "Ana Sutlović"
 * - "dr. sc. Ivana Lukica, predavač" -> "Ivana Lukica"
 * - "Antonia Treselj, dipl. prof., predavač" -> "Antonia Treselj"
 * - "Gabriela Vanja, mag. ing. techn. text., asistent" -> "Gabriela Vanja"
 */
export const extractName = (
	nameWithTitles: string | null | undefined
): string => {
	if (!nameWithTitles) {
		return '';
	}

	let cleaned = nameWithTitles.trim();

	// Remove everything after the first comma (job titles like "predavač", "asistent", etc.)
	// e.g. "dr. sc. Ivana Lukica, predavač" -> "dr. sc. Ivana Lukica"
	// e.g. "Antonia Treselj, dipl. prof., predavač" -> "Antonia Treselj"
	const commaIndex = cleaned.indexOf(',');
	if (commaIndex !== -1) {
		cleaned = cleaned.substring(0, commaIndex).trim();
	}

	// Remove common Croatian academic title prefixes
	// These can be single or multiple words, so we use a regex pattern
	const academicTitlePatterns = [
		/^izv\.\s*prof\.\s*dr\.\s*sc\.\s*/i, // "izv. prof. dr. sc."
		/^prof\.\s*dr\.\s*sc\.\s*/i, // "prof. dr. sc."
		/^doc\.\s*dr\.\s*sc\.\s*/i, // "doc. dr. sc."
		/^doc\.\s*art\.\s*/i, // "doc. art."
		/^prof\.\s*art\.\s*/i, // "prof. art."
		/^dr\.\s*sc\.\s*/i, // "dr. sc."
		/^dipl\.\s*prof\.\s*/i, // "dipl. prof."
		/^mag\.\s*ing\.\s*techn\.\s*text\.\s*/i, // "mag. ing. techn. text."
		/^mag\.\s*ing\.\s*/i // "mag. ing." (catch-all for other mag. ing. variants)
	];

	for (const pattern of academicTitlePatterns) {
		cleaned = cleaned.replace(pattern, '');
	}

	// Clean up any remaining whitespace
	cleaned = cleaned.replace(/\s+/g, ' ').trim();

	return cleaned;
};
