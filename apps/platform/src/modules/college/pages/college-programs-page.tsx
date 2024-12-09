import { api } from '@/lib/trpc/server';
import { CollegePrograms } from '@/modules/program/components/college-programs';

interface PageProps {
	params: {
		collegeSlug: string;
	};
}

export const CollegeProgramsPage = async ({ params }: PageProps) => {
	const { collegeSlug } = params;

	const college = await api.college.getBySlug({
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-2">
			<CollegePrograms collegeId={college.id} />
		</div>
	);
};
