import type {
	GetTranslationType,
	Language,
	TranslatedList,
	Translation,
	TranslationList
} from '.';

export const getTranslation = <
	T extends TranslationList | Translation,
	L extends Language
>(
	list: T,
	language: L
) => {
	const out = {} as TranslatedList;

	for (const key in list) {
		const val = list[key] as Translation | TranslationList;
		if (val.en === undefined) {
			// if val is translation list
			out[key] = getTranslation(val as TranslationList, language);
		} else {
			// if val is translation
			out[key] = (list[key] as Translation)[language];
		}
	}

	return out as GetTranslationType<typeof list, L>;
};
