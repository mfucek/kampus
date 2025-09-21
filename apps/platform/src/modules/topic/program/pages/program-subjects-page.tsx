import { api } from '@/deps/trpc/server';
import { CacheHelper } from '@/global/components/cache-helper';
import { ProgramSubjectsList } from '../components/program-subjects-list';

interface PageProps {
	params: Promise<{
		programSlug: string;
		collegeSlug: string;
	}>;
}

export const ProgramSubjectsPage = async ({ params }: PageProps) => {
	const { programSlug, collegeSlug } = await params;

	const program = await api.topic.program.getBySlug({
		programSlug,
		collegeSlug
	});

	const subjects = await api.topic.subject.listByProgramId({
		programId: program.topic.id
	});

	return (
		<div className="flex flex-col gap-10">
			<ProgramSubjectsList subjects={subjects.subjects} />
			<CacheHelper />
		</div>
	);
};
