import * as p from '@clack/prompts';

import { Spinner } from '@/deps/clack/spinner';
import { db } from '@/deps/prisma/db';
import { type Subject } from '@/types';

interface LinkSubjectStaffOptions {
	collegeId: string;
	subjectsData: Subject[];
}

const BATCH_SIZE_SUBJECT_STAFF = 75;

export const linkSubjectStaff = async ({
	collegeId,
	subjectsData
}: LinkSubjectStaffOptions) => {
	const subjectProfessorsCount = subjectsData.flatMap(
		(s) => s.professorsLinks
	).length;

	// ------------------
	// Remove existing subject-staff relationships in this college

	const removedSubjectStaffRelationships = await db.subjectStaff.deleteMany({
		where: {
			Subject: {
				collegeId: collegeId
			}
		}
	});

	p.log.info(
		`Removed ${removedSubjectStaffRelationships.count} existing subject-staff relationships in this college.`
	);

	// ------------------
	// Add subject-staff relationships

	const spinnerSubjectStaff = new Spinner(
		'Creating subject-staff relationships'
	);

	let createdSubjectStaffRelationships = 0;

	// [subjectLink, staffLink, role]
	const subjectStaffToCreate = subjectsData.flatMap((s) =>
		s.professorsLinks.map(
			({ link, role }) => [s.externalLink, link, role] as const
		)
	);

	// ------------------
	// Cache subject links

	// link -> id
	const subjectCache = new Map<string, string>();
	const dbSubjectsWithLink = await db.subject.findMany({
		where: {
			collegeId: collegeId,
			NOT: {
				externalLinks: {
					isEmpty: true
				}
			}
		},
		select: {
			topicId: true,
			externalLinks: true
		}
	});

	// store subjects in (link -> id) map
	for (const s of dbSubjectsWithLink) {
		for (const link of s.externalLinks) {
			subjectCache.set(link, s.topicId);
		}
	}

	// link -> id
	const staffCache = new Map<string, string>();
	const dbStaffWithLink = await db.staff.findMany({
		where: {
			collegeId: collegeId,
			staffExternalLink: {
				not: null
			}
		},
		select: {
			topicId: true,
			staffExternalLink: true
		}
	});
	for (const s of dbStaffWithLink) {
		staffCache.set(s.staffExternalLink!, s.topicId);
	}

	// ------------------

	for (
		let i = 0;
		i < subjectStaffToCreate.length;
		i += BATCH_SIZE_SUBJECT_STAFF
	) {
		const subjectStaffToCreateChunk = subjectStaffToCreate.slice(
			i,
			i + BATCH_SIZE_SUBJECT_STAFF
		);

		await db.$transaction(
			async (tx) => {
				for (const [
					subjectLink,
					staffLink,
					role
				] of subjectStaffToCreateChunk) {
					const subjectId = subjectCache.get(subjectLink);
					const staffId = staffCache.get(staffLink);

					if (!subjectId || !staffId) {
						console.log(
							`Subject or staff not found: ${subjectLink} ${staffLink}`
						);
						continue;
					}

					await tx.subjectStaff.create({
						data: {
							subjectId: subjectId,
							staffId: staffId,
							staffRole: role
						}
					});

					createdSubjectStaffRelationships += 1;
				}
			},
			{
				timeout: 30000
			}
		);

		spinnerSubjectStaff.onProgress(i, subjectProfessorsCount, 'subject-staff');
	}

	spinnerSubjectStaff.stop(
		`Created ${createdSubjectStaffRelationships} new subject-staff relationships.`
	);
};

// @TODO: add updating of existing staff records with new imageUrl
