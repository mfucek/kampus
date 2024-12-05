import * as p from '@clack/prompts';
import fs from 'fs';
import path from 'path';

import { write } from '@/utils/write';

import chalk from 'chalk';
import { formatDistance } from 'date-fns';
import { drivers, type College } from './drivers/drivers';

interface ScraperOptions {
	colleges: College[];
	fullScrape: boolean;
}

export const scraper = async (options: ScraperOptions) => {
	const { colleges, fullScrape } = options;

	// -----------------------------
	// clear terminal
	if (fullScrape) {
		console.clear();
	}

	// -----------------------------

	for (const c of colleges) {
		const key = c;
		const label = drivers[c].label;
		const driver = drivers[c].driver;

		// Initialize spinner
		const spinner = p.spinner();
		spinner.start();

		const outDir = path.join(
			process.cwd(),
			'out',
			key + (!fullScrape ? '-debug' : '')
		);

		// Make sure the output directory exists
		fs.mkdirSync(outDir, { recursive: true });

		let spinnerStartTime = Date.now();
		const startTime = Date.now();

		const result = await driver({
			debug: !fullScrape,
			callbacks: {
				onProgress: (progress, total, title) => {
					if (progress === 1 || progress === 0) {
						spinnerStartTime = Date.now();
					}

					const elapsedTime = Date.now() - spinnerStartTime;
					const estimatedTime = elapsedTime * (total / progress);
					const remainingTime = estimatedTime - elapsedTime;

					const remainingText = `${formatDistance(0, remainingTime, {
						includeSeconds: true
					})} remaining`;

					spinner.message(
						`${title && chalk.blue(title + ' ')}${
							progress + ' / ' + total
						} ${chalk.gray(remainingText)} `
					);
				}
			}
		});

		spinner.stop(`Done scraping ${label}.`);

		// Log results to files
		p.log.success(`Total subjects: ${chalk.yellow(result.subjects.length)}`);
		p.log.success(`Total programs: ${chalk.yellow(result.programs.length)}`);
		p.log.success(
			`Total professors: ${chalk.yellow(result.professors.length)}`
		);

		write(`${outDir}/subjects.json`, result.subjects);
		write(`${outDir}/programs.json`, result.programs);
		write(`${outDir}/professors.json`, result.professors);

		const elapsedTime = formatDistance(0, Date.now() - startTime, {
			includeSeconds: true
		});

		p.note(
			`Output directory: ${outDir}\n\nTook ${elapsedTime}`,
			`${label} scraped successfully!`
		);
	}

	p.outro('Done!');

	// Leave the browser open if it's a test run
	if (fullScrape) {
		process.exit(0);
	}
};
