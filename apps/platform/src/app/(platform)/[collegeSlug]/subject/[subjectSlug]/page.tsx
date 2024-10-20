import { SubjectPage } from '@/modules/subject/pages/subject-page';
import type { FC } from 'react';

interface PageProps {
	params: {
		collegeSlug: string;
		subjectSlug: string;
	};
}

const Page: FC<PageProps> = ({ params }) => {
	const { collegeSlug, subjectSlug } = params;

	return <SubjectPage collegeSlug={collegeSlug} subjectSlug={subjectSlug} />;
};

export default Page;
