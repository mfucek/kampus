import { StaffPage } from '@/modules/staff/pages/staff-page';
import type { FC } from 'react';

interface PageProps {
	params: {
		collegeSlug: string;
		staffSlug: string;
	};
}

const Page: FC<PageProps> = ({ params }) => {
	const { collegeSlug, staffSlug } = params;

	return <StaffPage collegeSlug={collegeSlug} staffSlug={staffSlug} />;
};

export default Page;
