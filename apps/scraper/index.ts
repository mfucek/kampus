import fs from 'fs/promises';
import puppeteer from 'puppeteer';

import subjectsJson from './subjects.json';

const write = async (fileName: string, data: any) => {
	await fs.writeFile(fileName, JSON.stringify(data, null, 2));
};

const deduplicateList = <T>(list: T[]) => [...new Set(list)];

const baseUrl = 'https://theta.ffzg.hr';
const orgJedUrl = '/ECTS/Struktura';
const preddiplomskiUrl = '/ECTS/Studij/Reformirani?razinaStudijaID=3';
const diplomskiUrl = '/ECTS/Studij/Reformirani?razinaStudijaID=4';

const browser = await puppeteer.launch({
	headless: false
});
const page = await browser.newPage();

const getStudies = async (url: string) => {
	await page.goto(url);

	const organizationalUnits = await page.$$eval('ol > li', (lis) =>
		lis.map((li) => {
			const name = li.innerText.trim();
			const anchor = li.querySelector('div > span > a');
			const href = anchor ? anchor.getAttribute('href') : '';
			return { name, href: href || '' };
		})
	);

	return organizationalUnits;
};

const getSubjects = async (url: string, orgUnitName: string) => {
	console.log(`Getting subjects for ${orgUnitName}`);

	await page.goto(url);

	// Click on the tag that has href="#structure"
	await page.click('a[href="#structure"]');
	await page.waitForSelector('.panel-body');

	const subjects = await page.evaluate((orgUnitName) => {
		const panelBodies = document.querySelectorAll('.panel-body');
		const allSubjects: any[] = [];

		panelBodies.forEach((panelBody, semester) => {
			const divs = panelBody.children;
			let sectionTitle = '';

			for (let i = 0; i < divs.length; i++) {
				if (i % 2 === 0) {
					// Even index: section title
					sectionTitle = divs[i].textContent?.trim().split(' -')[0] || '';
				} else {
					// Odd index: table of subjects
					const table = divs[i].querySelector('table');
					if (table) {
						const rows = table.querySelectorAll('tbody tr');
						rows.forEach((row) => {
							const columns = row.querySelectorAll('td');
							if (columns.length >= 3) {
								const subjectCode = columns[0].textContent?.trim() || '';
								const subjectName =
									columns[1].querySelector('a')?.textContent?.trim() || '';
								const professors =
									columns[1].querySelector('div')?.textContent?.trim() || '';
								const ects = columns[2].textContent?.trim() || '';

								allSubjects.push({
									sectionTitle,
									subjectCode,
									subjectName,
									professors: professors.split(',').map((p) => p.trim()),
									ects,
									orgUnitName,
									semester: semester + 1
								});
							}
						});
					}
				}
			}
		});

		return allSubjects;
	}, orgUnitName);

	return subjects;
};

const deduplicateSubjects = (subjects: any[]) => {
	let finalSubjects: Record<
		string,
		{
			sectionTitle: string[];
			subjectCode: string;
			subjectName: string;
			professors: string[];
			ects: string;
			orgUnitName: string[];
			semester: number[];
		}
	> = {};

	subjects.forEach((subject) => {
		if (!finalSubjects[subject.subjectCode]) {
			finalSubjects[subject.subjectCode] = {
				...subject,
				orgUnitName: [subject.orgUnitName],
				semester: [subject.semester],
				sectionTitle: [subject.sectionTitle]
			};
		} else {
			finalSubjects[subject.subjectCode].orgUnitName = deduplicateList([
				...finalSubjects[subject.subjectCode].orgUnitName,
				subject.orgUnitName
			]);
			finalSubjects[subject.subjectCode].semester = deduplicateList([
				...finalSubjects[subject.subjectCode].semester,
				subject.semester
			]);
			finalSubjects[subject.subjectCode].sectionTitle = deduplicateList([
				...finalSubjects[subject.subjectCode].sectionTitle,
				subject.sectionTitle
			]);
		}
	});

	return finalSubjects;
};

// const studies = [
// 	...(await getStudies(baseUrl + preddiplomskiUrl)),
// 	...(await getStudies(baseUrl + diplomskiUrl))
// ];
// await write('studies.json', studies);

// const subjects: any[] = [];
// for (let i = 0; i < studies.length; i++) {
// 	subjects.push(
// 		...(await getSubjects(baseUrl + studies[i].href, studies[i].name))
// 	);
// }
// await write('subjects.json', subjects);

const deduplicatedSubjects = deduplicateSubjects(subjectsJson);
await write('deduplicatedSubjects.json', deduplicatedSubjects);

await browser.close();
