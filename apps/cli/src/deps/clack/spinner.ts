import * as p from '@clack/prompts';
import chalk from 'chalk';
import { formatDistance } from 'date-fns';

export class Spinner {
	spinner: ReturnType<typeof p.spinner>;
	spinnerStartTime: number;

	constructor(title: string) {
		this.spinner = p.spinner();
		this.spinner.start(title);
		this.spinnerStartTime = Date.now();
	}

	onProgress(progress: number, total: number, title?: string) {
		if (progress === 1 || progress === 0) {
			this.spinnerStartTime = Date.now();
		}

		const elapsedTime = Date.now() - this.spinnerStartTime;
		const percentage = progress === 0 ? 0 : progress / total;
		const estimatedTime = elapsedTime * percentage;
		const remainingTime = estimatedTime - elapsedTime;

		const remainingText = `${formatDistance(0, remainingTime, {
			includeSeconds: true
		})} remaining`;

		this.spinner.message(
			`${title && chalk.blue(title + ' ')}${
				progress + ' / ' + total
			} ${chalk.gray(remainingText)} `
		);
	}

	stop(message: string) {
		this.spinner.stop(message);
	}
}
