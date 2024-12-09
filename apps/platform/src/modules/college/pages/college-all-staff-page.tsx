import { StaffsTableAdvanced } from '@/modules/staff/components/staffs-table-advanced';

interface PageProps {
	params: {
		collegeSlug: string;
	};
}

export const CollegeAllStaffPage = async ({ params }: PageProps) => {
	const { collegeSlug } = params;

	return (
		<div className="flex flex-col gap-2">
			<StaffsTableAdvanced scope={{ collegeSlug }} />
		</div>
	);
};
