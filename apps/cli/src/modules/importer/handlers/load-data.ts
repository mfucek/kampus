import * as p from '@clack/prompts';
import fs from 'fs';
import { z } from 'zod';

import { Spinner } from '@/deps/clack/spinner';
import { professorSchema, programSchema, subjectSchema } from '@/types';

interface LoadDataOptions {
	collegeSlug: string;
	inputDir: string;
}

export const loadData = async ({ collegeSlug, inputDir }: LoadDataOptions) => {
	const spinner = new Spinner('Loading data...');

	// ------------------
	// Check if input directory exists

	if (!fs.existsSync(inputDir)) {
		throw new Error('Input directory not found.');
	}

	// ------------------
	// Load data

	const professorsRaw = fs.readFileSync(`${inputDir}/professors.json`, 'utf8');
	const professorsData = z
		.array(professorSchema)
		.parse(JSON.parse(professorsRaw));

	const subjectsRaw = fs.readFileSync(`${inputDir}/subjects.json`, 'utf8');
	const subjectsData = z.array(subjectSchema).parse(JSON.parse(subjectsRaw));

	const programsRaw = fs.readFileSync(`${inputDir}/programs.json`, 'utf8');
	const programsData = z.array(programSchema).parse(JSON.parse(programsRaw));

	const professorsCount = professorsData.length;
	const subjectsCount = subjectsData.length;
	const programsCount = programsData.length;

	const subjectProfessorsCount = subjectsData.flatMap(
		(s) => s.professorsLinks
	).length;
	const programSubjectsCount = programsData.flatMap((p) => p.subjects).length;

	// ------------------

	spinner.stop('Data loaded.');

	p.note(`Professors: ${professorsCount}
Subjects: ${subjectsCount}
Programs: ${programsCount}
───
Subject-Staff: ${subjectProfessorsCount}
Program-Subject: ${programSubjectsCount}`);

	return { professorsData, subjectsData, programsData };
};
