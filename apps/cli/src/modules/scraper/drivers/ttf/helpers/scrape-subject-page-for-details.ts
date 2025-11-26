import type { ProfessorReference, Subject } from '@/types';
import type { Logger } from '@/utils/logger';
import type { Page } from 'puppeteer';

const titleSelector = 'h1.title';
const detailsSelector = '.htmlComponent h4.redTitle, .htmlComponent p';

const professorsTitle = 'nositelj';
const assistantsTitle = 'suradni';
const externalCodeTitle = 'ifra predme';
const ectsTitle = 'ects';

export const scrapeSubjectPageForDetails = async ({
	page,
	baseUrl,
	link,
	logger
}: {
	page: Page;
	baseUrl: string;
	link: string;
	logger?: Logger;
}) => {
	const result = await page.evaluate((baseUrl) => {
		const logs: Parameters<Logger['log']>[] = [];

		let ects: number | null = null;
		let externalCode: string | null = null;
		const professorsLinks: ProfessorReference[] = [];

		const name = document.querySelector(titleSelector)?.textContent;
		if (!name) return;

		const details = document.querySelectorAll<
			HTMLHeadingElement | HTMLParagraphElement
		>(detailsSelector);
		if (!details) return;

		let relevantDetail:
			| 'professors'
			| 'assistants'
			| 'externalCode'
			| 'ects'
			| null = null;
		details.forEach((detail) => {
			const isTitle = detail.tagName === 'H4';

			if (isTitle) {
				const text = detail.textContent;

				if (text?.toLowerCase().includes(professorsTitle)) {
					relevantDetail = 'professors';
				} else if (text?.toLowerCase().includes(assistantsTitle)) {
					relevantDetail = 'assistants';
				} else if (text?.toLowerCase().includes(externalCodeTitle)) {
					relevantDetail = 'externalCode';
				} else if (text?.toLowerCase().includes(ectsTitle)) {
					relevantDetail = 'ects';
				} else {
					relevantDetail = null;
				}
				return;
			}

			const isParagraph = detail.tagName === 'P';

			if (isParagraph) {
				const text = detail.textContent;

				if (relevantDetail === 'ects') {
					ects = Number(text);
				}

				if (relevantDetail === 'externalCode') {
					externalCode = text;
				}

				if (relevantDetail === 'professors') {
					const anchors = detail.querySelectorAll<HTMLAnchorElement>('a');

					anchors.forEach((anchor) => {
						const linkOriginal = anchor.getAttribute('href');
						if (!linkOriginal) return;

						let linkCorrected = window.sanitizeLink(linkOriginal, baseUrl);

						if (!linkCorrected) {
							logs.push([
								'error',
								'Invalid link: ' + linkOriginal + ' ... skipping'
							]);
							return;
						}

						if (linkOriginal !== linkCorrected) {
							logs.push([
								'warn',
								'Transformed link: ' + linkOriginal + ' -> ' + linkCorrected
							]);
						}

						professorsLinks.push({
							link: linkCorrected,
							role: 'Nositelj'
						});
					});
				}

				if (relevantDetail === 'assistants') {
					const anchors = detail.querySelectorAll<HTMLAnchorElement>('a');

					anchors.forEach((anchor) => {
						const linkOriginal = anchor.getAttribute('href');
						if (!linkOriginal) return;

						let linkCorrected = window.sanitizeLink(linkOriginal, baseUrl);

						if (!linkCorrected) {
							logs.push([
								'error',
								'Invalid link: ' + linkOriginal + ' ... skipping'
							]);
							return;
						}

						if (linkOriginal !== linkCorrected) {
							logs.push([
								'warn',
								'Transformed link: ' + linkOriginal + ' -> ' + linkCorrected
							]);
						}

						professorsLinks.push({
							link: linkCorrected,
							role: 'Suradnik'
						});
					});
				}
			}
		});

		return {
			name,
			ects: ects as number | null,
			externalCode: externalCode as string | null,
			professorsLinks,
			logs
		};
	}, baseUrl);

	if (!result) return;

	if (logger) result.logs.forEach((log) => logger.log(...log));

	const subject: Subject = {
		ects: result.ects,
		externalCode: result.externalCode,
		externalLink: link,
		name: result.name,
		shortName: null,
		professorsLinks: result.professorsLinks
	};

	return { subject };
};
