import { CollegePage } from '@/modules/college/pages/college-page';
import type { FC } from 'react';

interface PageProps {
	params: {
		collegeSlug: string;
	};
}

const Page: FC<PageProps> = ({ params }) => {
	const { collegeSlug } = params;

	return <CollegePage collegeSlug={collegeSlug} />;
};

export default Page;
