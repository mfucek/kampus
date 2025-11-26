import { ferDriver } from './fer';
import { ffzgDriver } from './ffzg';
import { fkitDriver } from './fkit';
import { pmfDriver } from './pmf';
import { ttfDriver } from './ttf';
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
	},
	fkit: {
		label: 'FKIT',
		slug: 'fkit',
		driver: fkitDriver
	},
	ttf: {
		label: 'TTF',
		slug: 'ttf',
		driver: ttfDriver
	}
};

export type College = keyof typeof drivers;
