import * as p from '@clack/prompts';
import fs from 'fs';
import path from 'path';

import { Logger } from '@/utils/logger';
import chalk from 'chalk';
import { formatDistance } from 'date-fns';
import { drivers, type College } from './drivers/drivers';
import { output } from './steps/output';

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
	// Run drivers for each college

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

		const logger = new Logger(
			path.join(process.cwd(), 'out', 'logs'),
			key + (!fullScrape ? '-debug' : '')
		);
		logger.log('info', 'Starting driver');

		let spinnerStartTime = Date.now();
		const startTime = Date.now();

		const result = await driver({
			debug: !fullScrape,
			logger,
			callbacks: {
				onProgress: (progress, total, title) => {
					if (progress === 0) {
						spinnerStartTime = Date.now();
					}

					const elapsedTime = Date.now() - spinnerStartTime;
					const estimatedTime =
						(elapsedTime / (progress === 0 ? 1 : progress)) * total;
					const remainingTime = estimatedTime - elapsedTime;

					const remainingText = `${formatDistance(0, remainingTime ?? 1000, {
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

		logger.log('info', `Done scraping ${label}.`);
		spinner.stop(`Done scraping ${label}.`);

		// Log results to files
		p.log.success(`Total subjects: ${chalk.yellow(result.subjects.length)}`);
		p.log.success(`Total programs: ${chalk.yellow(result.programs.length)}`);
		p.log.success(
			`Total professors: ${chalk.yellow(result.professors.length)}`
		);

		logger.log('info', `Outputting results to ${outDir}`);
		await output({
			outDir,
			subjects: result.subjects,
			programs: result.programs,
			professors: result.professors
		});

		const elapsedTime = formatDistance(0, Date.now() - startTime, {
			includeSeconds: true
		});

		logger.log('info', `Took ${elapsedTime}`);
		p.note(
			`Output directory: ${outDir}\n\nTook ${elapsedTime}`,
			`${label} scraped successfully!`
		);
	}

	// -----------------------------

	p.outro('Done!');

	// Leave the browser open if it's a test run
	if (fullScrape) {
	}
	process.exit(0);
};
