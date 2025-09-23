import * as p from '@clack/prompts';

import { Spinner } from '@/deps/clack/spinner';
import { db } from '@/deps/prisma/db';
import { type Program } from '@/types';

interface LinkProgramSubjectsOptions {
	collegeId: string;
	programsData: Program[];
}

const BATCH_SIZE_PROGRAM_SUBJECTS = 50;

export const linkProgramSubjects = async ({
	collegeId,
	programsData
}: LinkProgramSubjectsOptions) => {
	// ------------------
	// Remove existing program-subject relationships in this college

	const removedProgramSubjectRelationships = await db.programSubject.deleteMany(
		{
			where: {
				Program: {
					Topic: { collegeId: collegeId }
				}
			}
		}
	);

	p.log.info(
		`Removed ${removedProgramSubjectRelationships.count} existing program-subject relationships in this college.`
	);

	// ------------------
	// Add program-subject relationships

	const spinnerProgramSubjects = new Spinner(
		'Creating program-subject relationships'
	);

	let createdProgramSubjectRelationships = 0;

	// [programLink, subjectLink, semester, groupName]
	const programSubjectToCreate = programsData.flatMap((p) =>
		p.subjects.map(
			(s) => [p.externalLink, s.externalLink, s.semester, s.groupName] as const
		)
	);

	// ------------------
	// Cache program and subject links

	// link -> id
	const programCache = new Map<string, string>();
	const dbPrograms = await db.topic.findMany({
		where: {
			collegeId: collegeId,
			type: 'PROGRAM',
			Program: {
				programExternalLink: {
					not: null
				}
			}
		},
		select: {
			id: true,
			Program: {
				select: {
					programExternalLink: true
				}
			}
		}
	});
	for (const p of dbPrograms) {
		programCache.set(p.Program!.programExternalLink!, p.id);
	}

	// link -> id
	const subjectCache = new Map<string, string>();
	const dbSubjects = await db.topic.findMany({
		where: {
			collegeId: collegeId,
			type: 'SUBJECT',
			Subject: {
				// subjectExternalLink: {
				// 	not: null
				// }
				NOT: {
					externalLinks: {
						isEmpty: true
					}
				}
			}
		},
		select: {
			id: true,
			Subject: {
				select: {
					externalLinks: true
				}
			}
		}
	});
	for (const s of dbSubjects) {
		for (const link of s.Subject!.externalLinks) {
			subjectCache.set(link, s.id);
		}
	}

	// ------------------

	for (
		let i = 0;
		i < programSubjectToCreate.length;
		i += BATCH_SIZE_PROGRAM_SUBJECTS
	) {
		const chunk = programSubjectToCreate.slice(
			i,
			i + BATCH_SIZE_PROGRAM_SUBJECTS
		);

		await db.$transaction(
			async (tx) => {
				for (const [programLink, subjectLink, semester, groupName] of chunk) {
					const programId = programCache.get(programLink);
					const subjectId = subjectCache.get(subjectLink);

					if (!programId) {
						console.log(`Program not found: ${programLink}`);
						continue;
					}

					if (!subjectId) {
						console.log(`Subject not found: ${subjectLink}`);
						continue;
					}

					await tx.programSubject.create({
						data: {
							programId: programId,
							subjectId: subjectId,
							semester,
							groupName
						}
					});

					createdProgramSubjectRelationships += 1;
				}
			},
			{
				timeout: 30000
			}
		);

		spinnerProgramSubjects.onProgress(
			i,
			programSubjectToCreate.length,
			'program-subjects'
		);
	}

	spinnerProgramSubjects.stop(
		`Created ${createdProgramSubjectRelationships} new program-subject relationships.`
	);
};
