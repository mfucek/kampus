import { api } from '@/lib/trpc/server';
import { ProgramSubjectsList } from '../components/program-subjects-list';

interface PageProps {
	params: {
		programSlug: string;
		collegeSlug: string;
	};
}

export const ProgramSubjectsPage = async ({ params }: PageProps) => {
	const { programSlug, collegeSlug } = params;

	const program = await api.program.getBySlug({
		programSlug,
		collegeSlug
	});

	return (
		<div className="flex flex-col gap-2 pb-20">
			<ProgramSubjectsList programId={program.id} />
		</div>
	);
};
