import type { Page } from 'puppeteer';

import type { SubjectReference } from '@/types';
import type { Logger } from '@/utils/logger';
import { sanitizeTitle } from '@/utils/sanitize-title';

export const getSubjectReferencesFromProgramPage = async ({
	page,
	baseUrl,
	logger,
	tablesSelector,
	debug
}: {
	page: Page;
	baseUrl: string;
	logger?: Logger;
	tablesSelector: {
		tables: string;
		tableGroups: string;
	};
	debug?: boolean;
}) => {
	logger?.log('info', 'Getting subject references from program page');
	const semesterTableGroups = await page.$$(tablesSelector.tableGroups);

	logger?.log(
		'info',
		'Found ' +
			semesterTableGroups.length +
			' semester table groups with selector ' +
			tablesSelector.tableGroups
	);

	const result = await page.evaluate(
		(baseUrl, tablesSelector) => {
			let subjectReferences: SubjectReference[] = [];

			const semesterTableGroups = Array.from(
				document.querySelectorAll(tablesSelector.tableGroups)
			);

			for (const semesterTableGroup of semesterTableGroups) {
				const semesterTables = Array.from(
					semesterTableGroup.querySelectorAll(tablesSelector.tables)
				);

				// Go through each semester
				for (
					let semesterIndex = 0;
					semesterIndex < semesterTables.length;
					semesterIndex++
				) {
					const semesterTable = semesterTables[semesterIndex];
					const rows = Array.from(semesterTable.querySelectorAll('tr'));

					let sectionTitle = '';

					for (const row of rows) {
						const hasPredmetClass = row.classList.contains('predmet');
						const hasThChild = row.querySelector('th');
						const hasStripeClass =
							row.classList.contains('cms_table_row_0') ||
							row.classList.contains('cms_table_row_1');
						const hasAnchorChild = row.querySelector('td:nth-child(2) > a');

						// It is a section title
						if (hasPredmetClass || (hasStripeClass && hasThChild)) {
							const rawText = row.querySelector('td:nth-child(2)')?.textContent;

							if (
								rawText?.toLowerCase().includes('obvez') &&
								rawText?.toLowerCase().includes('izbo')
							) {
								sectionTitle = 'Obvezni Izborni Predmeti';
								continue;
							}

							if (
								rawText?.toLowerCase().includes('izvan') &&
								rawText?.toLowerCase().includes('izbo')
							) {
								sectionTitle = 'Izborni Predmeti izvan Odabranih Grana';
								continue;
							}

							if (rawText?.toLowerCase().includes('izbo')) {
								sectionTitle = 'Izborni Predmeti';
								continue;
							}

							if (rawText?.toLowerCase().includes('fakultativni')) {
								sectionTitle = 'Fakultativni Predmeti';
								continue;
							}

							if (rawText?.toLowerCase().includes('redovni')) {
								sectionTitle = 'Redovni Predmeti';
								continue;
							}

							if (rawText?.toLowerCase().includes('obvez')) {
								sectionTitle = 'Obvezni Predmeti';
								continue;
							}

							sectionTitle =
								rawText?.trim().split('\n')[0].split('=>')[0].split(' ,')[0] ||
								'';
							sectionTitle = sanitizeTitle(sectionTitle);
							continue;
						}

						// It is a subject
						if (hasStripeClass && hasAnchorChild) {
							const subjectLink =
								row
									.querySelector('td:nth-child(2) > a')
									?.getAttribute('href') || '';

							subjectReferences.push({
								externalLink: baseUrl + subjectLink,
								semester: semesterIndex + 1,
								groupName: sectionTitle
							});
						}
					}
				}
			}

			return { subjectReferences };
		},
		baseUrl,
		tablesSelector
	);

	return result.subjectReferences;
};
