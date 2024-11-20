import puppeteer from 'puppeteer';

import type { Driver } from '@/modules/driver/types';
import type { Professor, Program, Subject, SubjectReference } from '@/types';
import { shortenList } from '@/utils/shorten-list';

export const ferDriver: Driver = async ({ debug = false, callbacks }) => {
	// Initialize browser
	const browser = await puppeteer.launch({
		headless: !debug,
		devtools: debug
	});
	const page = await browser.newPage();

	// -----------------------------
	// URLs

	const baseUrl = 'https://www.fer.unizg.hr';
	const urlPrograms = 'https://www.fer.unizg.hr/studiji';

	// -----------------------------
	// Initialize lists

	const programsList: { [externalLink: string]: Program } = {};
	const subjectsList: { [externalLink: string]: Subject } = {};
	const professorsList: { [externalLink: string]: Professor } = {};
	let counter = 0;

	// -----------------------------
	// Scrape programs

	await page.goto(urlPrograms);

	// preddiplomski
	const selectorPreddiplomski = '.row.two-col > .col-md-6 > h4 > a';

	(
		await page.evaluate(
			(selector, baseUrl) => {
				const programs = document.querySelectorAll(selector);
				const results: Program[] = [];

				programs.forEach((program) => {
					const name = program.textContent?.trim() || '';
					const link = baseUrl + program.getAttribute('href') || '';
					const shortName = link.split('/').pop() || '';

					results.push({
						name,
						shortName,
						externalLink: link,
						departments: [],
						subjects: [],
						type: 'preddiplomski'
					});
				});

				return results;
			},
			selectorPreddiplomski,
			baseUrl
		)
	).map((program) => {
		programsList[program.externalLink] = program;
	});

	// diplomski
	const selectorDiplomski = '.col-md-4 > ul > li > a';

	(
		await page.evaluate(
			(selector, baseUrl) => {
				const programs = document.querySelectorAll(selector);
				const results: Program[] = [];

				programs.forEach((program) => {
					const name = program.textContent?.trim() || '';
					const link = program.getAttribute('href') || '';
					const shortName = link.split('/').pop() || '';

					if (link && name) {
						results.push({
							name,
							shortName,
							externalLink: link,
							departments: [],
							subjects: [],
							type: 'diplomski'
						});
					}
				});

				return results;
			},
			selectorDiplomski,
			baseUrl
		)
	).map((program) => {
		programsList[program.externalLink] = program;
	});

	// -----------------------------
	// Get all subjects for each program

	const selectorSemesterTabContents = '.col-md-12.div-striped';

	// Go through all programs and make references to subject links
	counter = 0;
	for await (const program of shortenList(Object.values(programsList), {
		enabled: debug
	})) {
		counter += 1;
		callbacks?.onProgress?.(counter, Object.keys(programsList).length, false);

		await page.goto(program.externalLink);

		let programSemesters = await page.evaluate(
			(selector, baseUrl) => {
				const contents = document.querySelectorAll(selector);

				let outputSemesters: SubjectReference[] = [];

				// Go through each semester
				contents.forEach((content, semester) => {
					const rows = content.querySelectorAll('& > .row');

					console.log(rows);

					let sectionTitle = '';

					Array.from(rows).forEach((row) => {
						// It is a section title
						if (row.classList.length === 1) {
							sectionTitle =
								row.textContent
									?.split('\n')[0]
									.split('(')[0]
									.split('-')[0]
									.trim() || '';
							return;
						}
						const link =
							baseUrl + row.querySelector('& a')?.getAttribute('href') || '';
						// const shortName = link.split('/').pop() || '';

						outputSemesters.push({
							externalLink: link,
							semester: semester + 1,
							groupName: sectionTitle
						});
					});
				});
				return outputSemesters;
			},
			selectorSemesterTabContents,
			baseUrl
		);

		program.subjects = programSemesters;
	}

	// -----------------------------
	// Get all unique subject links

	const subjectLinks = [
		...new Set(
			Object.values(programsList).flatMap((program) =>
				program.subjects.map((subject) => subject.externalLink)
			)
		)
	];

	// -----------------------------
	// Scrape each subject link

	counter = 0;

	for await (const subjectLink of shortenList(subjectLinks, {
		enabled: debug,
		maxLength: 5
	})) {
		await page.goto(subjectLink);

		counter += 1;
		callbacks?.onProgress?.(counter, subjectLinks.length, false);

		const result = await page.evaluate(
			(subjectLink, baseUrl) => {
				const subjectName =
					document
						.querySelector('.portlet_course_staff_list > .cms_module_title')
						?.textContent?.trim() || '';

				const subjectCode =
					document
						.querySelector('.bodoviInfoRow > .col-md-12:nth-child(1)')
						?.textContent?.split(' ')[1]
						?.trim() || '';

				const subjectEcts =
					document
						.querySelector('.bodoviInfoRow > .col-md-12:nth-child(4) > strong')
						?.textContent?.trim() || '';

				const professorsList: { professor: Professor; groupName: string }[] =
					[];

				let groupName = '';
				document
					.querySelectorAll('.content, h4')
					.forEach((professorSectionOrHeading) => {
						if (professorSectionOrHeading.tagName === 'H4') {
							groupName = professorSectionOrHeading.textContent?.trim() || '';
							return;
						}

						const professorsInSection =
							professorSectionOrHeading.querySelectorAll('.staff-list');

						if (professorsInSection.length === 0) {
							return;
						}

						professorsInSection.forEach((professor) => {
							professor
								.querySelector('.staff-list .staffname')
								?.textContent?.trim() || '';
							const link =
								baseUrl +
									professor
										.querySelector('.staff-list a')
										?.getAttribute('href') || '';
							const imageUrl =
								baseUrl +
									professor
										.querySelector('.staff-list img')
										?.getAttribute('src') || '';

							professorsList.push({
								professor: { name: subjectName, imageUrl, externalLink: link },
								groupName: groupName
							});
						});
					});

				return {
					subject: {
						externalLink: subjectLink,
						name: subjectName,
						shortName: '',
						externalCode: subjectCode,
						ects: Number(subjectEcts),
						professorsLinks: professorsList.map((p) => ({
							groupName: p.groupName,
							link: p.professor.externalLink
						}))
					},
					professors: professorsList
				};
			},
			subjectLink,
			baseUrl
		);

		subjectsList[subjectLink] = result.subject;

		for (const professor of result.professors) {
			professorsList[professor.professor.externalLink] = professor.professor;
		}
	}

	// -----------------------------
	// Finish progress

	callbacks?.onProgress?.(
		Object.keys(programsList).length,
		debug ? Object.keys(subjectLinks).length : 5,
		true
	);

	// -----------------------------
	// Close browser

	if (!debug) {
		await browser.close();
	}

	// -----------------------------
	// Return results

	return {
		programs: Object.values(programsList),
		professors: Object.values(professorsList),
		subjects: Object.values(subjectsList)
	};
};
