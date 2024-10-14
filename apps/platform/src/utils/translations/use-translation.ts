import type { Language } from '.';
import { getTranslation } from './get-translation';
import { strings } from './strings';

export const useTranslation = (language: Language) => {
	const t = getTranslation(strings, language);
	return { t };
};
