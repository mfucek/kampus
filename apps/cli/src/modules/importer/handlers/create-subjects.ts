import { Spinner } from '@/deps/clack/spinner';
import { db } from '@/deps/prisma/db';
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

	const existingSubjects = await db.subject.findMany({
		where: {
			collegeId: collegeId
		},
		include: {
			Topic: true
		}
	});

	const existingSubjectSlugs = new Set(
		existingSubjects.map((s) => s.Topic.slug)
	);
	const existingSubjectExternalLinks = new Set(
		existingSubjects.flatMap((s) => s.externalLinks).filter(Boolean) as string[]
	);

	const subjectsToCreate = subjectsData.filter(
		(s) =>
			!existingSubjectExternalLinks.has(s.externalLink) &&
			!existingSubjectSlugs.has(slugify(s.name))
	);

	let createdSubjects = 0;

	for (let i = 0; i < subjectsToCreate.length; i += BATCH_SIZE_SUBJECTS) {
		const subjectsToCreateChunk = subjectsToCreate.slice(
			i,
			i + BATCH_SIZE_SUBJECTS
		);

		await db.$transaction(
			async (tx) => {
				for (const subjectToCreate of subjectsToCreateChunk) {
					try {
						// first create the topic
						const newTopic = await tx.topic.create({
							data: {
								type: 'SUBJECT',
								slug: slugify(subjectToCreate.name),
								name: subjectToCreate.name,
								shortName: slugify(subjectToCreate.name)
							}
						});

						// then create the subject
						await tx.subject.create({
							data: {
								topicId: newTopic.id,
								collegeId: collegeId,
								ects: subjectToCreate.ects,
								externalCodes: subjectToCreate.externalCode
									? [subjectToCreate.externalCode]
									: [],
								externalLinks: [subjectToCreate.externalLink]
							}
						});
					} catch (error) {
						console.error(subjectToCreate.name, error);
						throw error;
					}

					createdSubjects += 1;
				}
			},
			{
				timeout: 20000
			}
		);

		spinnerSubjects.onProgress(i, subjectsToCreate.length, 'Creating subjects');
	}

	spinnerSubjects.stop(`Created ${createdSubjects} new subjects.`);
};
