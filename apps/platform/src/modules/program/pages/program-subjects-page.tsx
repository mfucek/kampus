import { CacheHelper } from '@/global/components/cache-helper';
import { api } from '@/lib/trpc/server';
import { ProgramSubjectsList } from '../components/program-subjects-list';

interface PageProps {
	params: Promise<{
		programSlug: string;
		collegeSlug: string;
	}>;
}

export const ProgramSubjectsPage = async ({ params }: PageProps) => {
	const { programSlug, collegeSlug } = await params;

	const program = await api.program.getBySlug({
		programSlug,
		collegeSlug
	});

	const subjects = await api.program.listSubjects({
		programId: program.id
	});

	return (
		<div className="flex flex-col gap-10">
			<ProgramSubjectsList subjects={subjects} />
			<CacheHelper />
		</div>
	);
};
