import { StaffsTableAdvanced } from '@/modules/staff/components/staffs-table-advanced';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

export const CollegeAllStaffPage = async ({ params }: PageProps) => {
	const { collegeSlug } = await params;

	return (
		<div className="flex flex-col gap-2 px-4 lg:px-0">
			<StaffsTableAdvanced scope={{ collegeSlug }} />
		</div>
	);
};
