import type { Professor, Program, Subject } from '@/types';
import { write } from '@/utils/write';

interface OutputArgs {
	outDir: string;
	subjects: Subject[];
	programs: Program[];
	professors: Professor[];
}

export const output = async ({
	outDir,
	subjects,
	programs,
	professors
}: OutputArgs) => {
	write(`${outDir}/subjects.json`, subjects);
	write(`${outDir}/programs.json`, programs);
	write(`${outDir}/professors.json`, professors);
};
