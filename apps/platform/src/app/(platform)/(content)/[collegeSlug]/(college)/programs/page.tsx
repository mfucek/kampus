import { db } from '@/lib/db';
import { CollegeProgramsPage } from '@/modules/topic/college/pages/college-programs-page';

export default CollegeProgramsPage;

export const dynamic = 'force-static';

export const generateStaticParams = async () => {
	const collegeSlugs = (await db.college.findMany()).map((college) => ({
		collegeSlug: college.slug
	}));

	return collegeSlugs;
};
