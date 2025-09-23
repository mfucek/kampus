export const languages = ['hr', 'en'] as const;

export type Language = (typeof languages)[number];
export type Translation = Record<Language, string>;
export type TranslationList = { [key: string]: Translation | TranslationList };
export type TranslatedList = {
	[key: string]: object | string | TranslatedList;
};
export type GetTranslationType<Type, L extends Language> = {
	[Key in keyof Type]: Type[Key] extends Translation
		? Type[Key][L]
		: GetTranslationType<Type[Key], L>;
};
