import { ferDriver } from './fer';
import { ffzgDriver } from './ffzg';
import { pmfDriver } from './pmf';
import type { Driver } from './types';

export const drivers: Record<
	string,
	{ label: string; slug: string; driver: Driver }
> = {
	fer: {
		label: 'FER',
		slug: 'fer',
		driver: ferDriver
	},
	ffzg: {
		label: 'FFZG',
		slug: 'ffzg',
		driver: ffzgDriver
	},
	pmf: {
		label: 'PMF',
		slug: 'pmf',
		driver: pmfDriver
	}
};

export type College = keyof typeof drivers;
