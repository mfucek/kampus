import { hydrateWindowWithUtilFunctions } from '@/lib/puppeteer/utils/hydrate-window-with-util-functions';
import type { Program } from '@/types';
import { sanitizeTitle } from '@/utils/sanitize-title';
import { slugify } from '@/utils/slugify';
import type { Browser } from 'puppeteer';

const handleProgramPage = async ({
	browser,
	baseUrl,
	url,
	selector
}: {
	browser: Browser;
	baseUrl: string;
	url: string;
	selector: string;
}) => {};

export const handleProgramList = async ({
	browser,
	baseUrl,
	departmentsUrl
}: {
	browser: Browser;
	baseUrl: string;
	departmentsUrl: Record<
		string,
		Record<string, { url: string; selector: string }>
	>;
}) => {
	const results: Program[] = [];

	const page = (await browser.pages())[0];

	for (const [department, programUrlsSelector] of Object.entries(
		departmentsUrl
	)) {
		for await (const [programType, { url, selector }] of Object.entries(
			programUrlsSelector
		)) {
			if (page.url() !== url) {
				await page.goto(url);
				await hydrateWindowWithUtilFunctions(page);
			}

			// gather links to visit, from navigation
			const programsToVisit = await page.evaluate(
				(baseUrl, selector) => {
					const anchors = Array.from(document.querySelectorAll(selector));

					const output: { name: string; link: string }[] = [];

					for (const anchor of anchors) {
						const name = anchor.textContent?.trim() || '';
						const link = anchor.getAttribute('href') || '';
						output.push({ name: name, link: baseUrl + link });
					}

					return output;
				},
				baseUrl,
				selector
			);

			// -----------------------------
			// visit each program candidate

			for (const {
				name: mainProgramName,
				link: mainProgramLink
			} of programsToVisit) {
				if (page.url() !== mainProgramLink) {
					await page.goto(mainProgramLink);
					await hydrateWindowWithUtilFunctions(page);
				}

				// check if there are sub-programs
				const subPrograms = await page.evaluate(
					(baseUrl, selector) => {
						const anchors = Array.from(
							document.querySelectorAll(
								'.portlet_content .cms_module_html ul li a'
							)
						);
						return anchors.map((anchor) => {
							const name = anchor.textContent?.trim() || '';
							const link = anchor.getAttribute('href') || '';
							return { name: name, link: baseUrl + link };
						});
					},
					baseUrl,
					selector
				);

				// handle sub-programs
				for (const subProgram of subPrograms) {
					let subProgramName = subProgram.name;

					subProgramName = subProgramName.split('Smjer: ').reverse()[0];
					subProgramName = subProgramName.split('modul ').reverse()[0];
					subProgramName = subProgramName.split('(')[0];
					subProgramName = subProgramName.trim();

					results.push({
						externalLink: subProgram.link,
						name: sanitizeTitle(`${mainProgramName} (${subProgramName})`),
						shortName: slugify(
							`${
								programType.split(' ')[0]
							} ${mainProgramName} ${subProgramName}`
						),
						departments: [department],
						type: programType,
						subjects: []
					});
				}

				if (subPrograms.length > 0) {
					continue;
				}

				// include main program if there are no sub-programs
				results.push({
					externalLink: mainProgramLink,
					name: sanitizeTitle(mainProgramName),
					shortName: slugify(`${programType.split(' ')[0]} ${mainProgramName}`),
					departments: [department],
					type: programType,
					subjects: []
				});
			}
		}
	}

	return results;
};
