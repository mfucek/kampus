import type { SubjectReference } from '@/types';
import type { Logger } from '@/utils/logger';
import type { Page } from 'puppeteer';

const semesterTableSelector = '.tableComponent';
const tableTitleSelector = '.title';

const tableSemesterRowsSelector = 'table tbody tr > td:first-child > a';
const tableIzborniRowsSelector = 'table tbody tr';
const izborniRowAnchorSelector = 'td:first-child > a';

export const scrapePageForSubjectReferences = async ({
	page,
	baseUrl,
	offset,
	logger
}: {
	page: Page;
	baseUrl: string;
	offset: number;
	logger?: Logger;
}) => {
	const subjectReferences: SubjectReference[] = [];

	const result = await page.evaluate(
		(
			baseUrl,
			semesterTableSelector,
			tableTitleSelector,
			tableSemesterRowsSelector,
			tableIzborniRowsSelector,
			izborniRowAnchorSelector,
			offset
		) => {
			const logs: Parameters<Logger['log']>[] = [];
			const semesterSubjectReferences: SubjectReference[] = [];

			const tables = document.querySelectorAll<HTMLTableElement>(
				semesterTableSelector
			);

			let semesterNumber: number;

			// obvezni predmeti

			semesterNumber = offset;
			tables.forEach((table) => {
				const title = table.querySelector(tableTitleSelector)?.textContent;
				const isIzborni = title?.toLowerCase().includes('izborni');

				if (title && isIzborni) return;

				semesterNumber += 1;

				const anchors = table.querySelectorAll<HTMLAnchorElement>(
					tableSemesterRowsSelector
				);

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

					semesterSubjectReferences.push({
						externalLink: linkCorrected,
						groupName: 'Obavezni predmeti',
						semester: semesterNumber
					});
				});
			});

			// izborni predmeti

			semesterNumber = offset + 1;
			tables.forEach((table) => {
				const title = table.querySelector(tableTitleSelector)?.textContent;
				const isIzborni = title?.toLowerCase().includes('izborni');

				if (title && !isIzborni) return;

				const rows = table.querySelectorAll<HTMLAnchorElement>(
					tableIzborniRowsSelector
				);

				rows.forEach((row) => {
					const isEmpty = row.textContent.trim() === '';

					if (isEmpty) {
						semesterNumber += 1;
						return;
					}

					const anchor = row.querySelector<HTMLAnchorElement>(
						izborniRowAnchorSelector
					);
					if (!anchor) return;

					const linkOriginal = row.getAttribute('href');
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

					semesterSubjectReferences.push({
						externalLink: linkCorrected,
						groupName: 'Izborni predmeti',
						semester: semesterNumber
					});
				});
			});

			return { subjectReference: semesterSubjectReferences, logs };
		},
		baseUrl,
		semesterTableSelector,
		tableTitleSelector,
		tableSemesterRowsSelector,
		tableIzborniRowsSelector,
		izborniRowAnchorSelector,
		offset
	);

	if (logger) result.logs.forEach((log) => logger.log(...log));

	result.subjectReference.forEach((subjectReference) => {
		subjectReferences.push(subjectReference);
	});

	return { subjectReferences };
};
