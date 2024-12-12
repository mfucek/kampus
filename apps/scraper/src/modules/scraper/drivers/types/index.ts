import type { DriverOptions, Professor, Program, Subject } from '@/types';

export type Driver = (options: DriverOptions) => Promise<{
	programs: Program[];
	professors: Professor[];
	subjects: Subject[];
}>;
