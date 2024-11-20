import puppeteer from 'puppeteer';

import type { Driver } from '@/modules/driver/types';
import type { Professor, Program, Subject } from '@/types';

export const ffzgDriver: Driver = async ({ debug = false, callbacks }) => {
	// Initialize browser
	const browser = await puppeteer.launch({
		headless: !debug,
		devtools: debug
	});
	const page = await browser.newPage();

	// -----------------------------

	const baseUrl = 'https://www.ffzg.unizg.hr';

	// -----------------------------

	const programsList: { [externalLink: string]: Program } = {};
	const subjectsList: { [externalLink: string]: Subject } = {};
	const professorsList: { [externalLink: string]: Professor } = {};

	// -----------------------------

	callbacks?.onProgress?.(0, 0, true);

	return {
		programs: [],
		professors: [],
		subjects: []
	};
};
