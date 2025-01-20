import { db } from '@/lib/db';
import { ProgramSubjectsPage } from '@/modules/topic/program/pages/program-subjects-page';

export default ProgramSubjectsPage;

export const dynamic = 'force-static';

export const generateStaticParams = async () => {
	const programs = await db.topic.findMany({
		where: {
			type: 'PROGRAM',
			Program: {
				isNot: null
			}
		},
		select: {
			College: {
				select: {
					slug: true
				}
			},
			slug: true
		}
	});

	const slugs = programs.map((program) => ({
		collegeSlug: program.College.slug,
		programSlug: program.slug
	}));

	return slugs;
};
