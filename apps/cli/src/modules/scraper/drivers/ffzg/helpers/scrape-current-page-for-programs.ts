import type { Program } from '@/types';
import type { Page } from 'puppeteer';

export const scrapeCurrentPageForPrograms = async ({
	page,
	baseUrl
}: {
	page: Page;
	baseUrl: string;
}) => {
	const programsList: { [externalLink: string]: Program } = {};

	(
		await page.evaluate((baseUrl) => {
			const programGroupHeadings = document.querySelectorAll(
				'.table .col-xs-6 h4'
			);
			const programGroups = document.querySelectorAll('.table .col-xs-6 ol');

			const results: Program[] = [];

			programGroups.forEach((programGroup, index) => {
				const heading = window.sanitizeTitle(
					programGroupHeadings[index].textContent
				);

				programGroup.querySelectorAll('a').forEach((program) => {
					const name = window.sanitizeTitle(program.textContent);

					const link = baseUrl + program.getAttribute('href') || '';

					results.push({
						name,
						externalLink: link,
						shortName: window.slugify(name),
						departments: [],
						subjects: [],
						type: heading
					});
				});
			});

			return results;
		}, baseUrl)
	).map((program) => {
		programsList[program.externalLink] = program;
	});

	return programsList;
};
