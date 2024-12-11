import { CacheHelper } from '@/global/components/cache-helper';
import { api } from '@/lib/trpc/server';
import { CollegePrograms } from '@/modules/program/components/college-programs';

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

	return (
		<div className="flex flex-col gap-2 pb-20">
			<CollegePrograms collegeId={college.id} />
			<CacheHelper />
		</div>
	);
};
