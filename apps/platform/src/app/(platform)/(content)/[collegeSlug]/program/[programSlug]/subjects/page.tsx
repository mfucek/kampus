import { db } from '@/deps/prisma';
import { ProgramSubjectsPage } from '@/modules/topic/program/pages/program-subjects-page';

export default ProgramSubjectsPage;

export const dynamic = 'force-static';

export const generateStaticParams = async () => {
	const programs = await db.program.findMany({
		include: {
			Topic: true,
			College: {
				include: {
					Topic: true
				}
			}
		}
	});

	const slugs = programs.map((program) => ({
		collegeSlug: program.College.Topic.slug,
		programSlug: program.Topic.slug
	}));

	return slugs;
};
