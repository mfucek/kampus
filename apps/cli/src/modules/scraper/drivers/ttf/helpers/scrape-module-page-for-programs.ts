import type { Program } from '@/types';
import type { Page } from 'puppeteer';

const cardTitleSelector = '.textBlock h3';

export const scrapeModulePageForPrograms = async ({
	page,
	baseUrl,
	selectorProgramCards,
	type,
	moduleTitle
}: {
	page: Page;
	baseUrl: string;
	selectorProgramCards: string;
	type: string;
	moduleTitle: string;
}) => {
	const programsList: { [externalLink: string]: Program } = {};

	const programs = await page.evaluate(
		(baseUrl, type, moduleTitle, selectorProgramCards) => {
			const programAnchors =
				document.querySelectorAll<HTMLAnchorElement>(selectorProgramCards);

			const results: Program[] = [];

			programAnchors.forEach((programAnchor, index) => {
				const heading = programAnchor.querySelector(cardTitleSelector);

				const name = window.sanitizeTitle(heading?.textContent);
				const link = programAnchor.getAttribute('href');
				const slug = window.slugify(name);

				results.push({
					name,
					externalLink: link ? baseUrl + link : '',
					shortName: window.slugify(name),
					departments: [moduleTitle],
					subjects: [],
					type: type
				});
			});

			return results;
		},
		baseUrl,
		type,
		moduleTitle,
		selectorProgramCards
	);

	programs.map((program) => {
		programsList[program.externalLink] = program;
	});

	return { programsList };
};
