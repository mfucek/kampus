import { api } from '@/lib/trpc/server';
import { SubjectsTableAdvanced } from '@/modules/subject/components/subjects-table-advanced';

interface PageProps {
	params: {
		collegeSlug: string;
	};
}

export const CollegeAllSubjectsPage = async ({ params }: PageProps) => {
	const { collegeSlug } = params;

	const college = await api.college.getBySlug({
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-2 px-4 lg:px-0">
			<SubjectsTableAdvanced scope={{ collegeId: college.id }} />
		</div>
	);
};
