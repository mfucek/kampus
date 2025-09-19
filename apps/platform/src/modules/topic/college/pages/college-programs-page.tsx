import { api } from '@/deps/trpc/server';
import { CacheHelper } from '@/global/components/cache-helper';
import { CollegeProgramsList } from '@/modules/topic/college/components/college-programs-list';

interface PageProps {
	params: Promise<{
		collegeSlug: string;
	}>;
}

export const CollegeProgramsPage = async ({ params }: PageProps) => {
	const { collegeSlug } = await params;

	const college = await api.college.getBySlug({
		collegeSlug
	});

	const programs = await api.college.listPrograms({
		collegeId: college.id
	});

	return (
		<div className="flex flex-col gap-10">
			<CollegeProgramsList programs={programs} />
			<CacheHelper />
		</div>
	);
};
