import { Spinner } from '@/lib/clack/spinner';
import { db } from '@/lib/prisma/db';
import { type Subject } from '@/types';
import { slugify } from '@/utils/slugify';

interface ImportSubjectsOptions {
	collegeId: string;
	subjectsData: Subject[];
}

const BATCH_SIZE_SUBJECTS = 25;

export const createSubjects = async ({
	collegeId,
	subjectsData
}: ImportSubjectsOptions) => {
	// ------------------
	// Create subjects

	const spinnerSubjects = new Spinner('Creating subjects');

	const existingSubjects = await db.topic.findMany({
		where: {
			collegeId: collegeId,
			type: 'SUBJECT',
			Subject: {
				isNot: null
			}
		},
		include: {
			Subject: true
		}
	});

	const existingSubjectSlugs = new Set(existingSubjects.map((s) => s.slug));
	const existingSubjectExternalLinks = new Set(
		existingSubjects
			.map((s) => s.Subject!.subjectExternalLink)
			.filter(Boolean) as string[]
	);

	const subjectsToCreate = subjectsData.filter(
		(s) =>
			!existingSubjectExternalLinks.has(s.externalLink) &&
			!existingSubjectSlugs.has(slugify(s.name))
	);

	let createdSubjects = 0;

	for (let i = 0; i < subjectsToCreate.length; i += BATCH_SIZE_SUBJECTS) {
		const chunk = subjectsToCreate.slice(i, i + BATCH_SIZE_SUBJECTS);

		await db.$transaction(async (tx) => {
			for (const subject of chunk) {
				const newTopic = await tx.topic.create({
					data: {
						type: 'SUBJECT',
						slug: slugify(subject.name),
						name: subject.name,
						collegeId: collegeId,
						shortName: slugify(subject.name)
					}
				});

				await tx.subject.create({
					data: {
						Topic: { connect: { id: newTopic.id } },
						ects: subject.ects,
						subjectExternalCode: subject.externalCode,
						subjectExternalLink: subject.externalLink
					}
				});
			}
		});

		createdSubjects += chunk.length;
		spinnerSubjects.onProgress(
			createdSubjects,
			subjectsToCreate.length,
			'Creating subjects'
		);
	}

	spinnerSubjects.stop(`Created ${createdSubjects} new subjects.`);
};
