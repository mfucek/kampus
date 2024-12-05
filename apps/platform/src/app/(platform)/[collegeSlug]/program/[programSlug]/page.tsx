import type { FC } from 'react';

import { ProgramPage } from '@/modules/program/pages/program-page';

interface PageProps {
	params: {
		collegeSlug: string;
		programSlug: string;
	};
}

const Page: FC<PageProps> = ({ params }) => {
	const { collegeSlug, programSlug } = params;

	return <ProgramPage collegeSlug={collegeSlug} programSlug={programSlug} />;
};

export default Page;
