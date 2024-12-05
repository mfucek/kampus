import type { FC } from 'react';

import { Container } from '@/global/components/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn/ui/tabs';
import { api } from '@/lib/trpc/server';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/composer/components';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';
import { ProgramSubjectsList } from '../components/program-subjects-list';

const DiscussionTab: FC<{
	programId: string;
	collegeId: string;
}> = async ({ programId, collegeId }) => {
	return (
		<div className="flex flex-col gap-10">
			<Composer collegeId={collegeId} topicId={programId} />
			<InfiniteScrollTopLevelPosts scope={{ topic: { id: programId } }} />
		</div>
	);
};

const SubjectsTab: FC<{ programId: string }> = async ({ programId }) => {
	return (
		<div className="flex flex-col gap-2">
			<ProgramSubjectsList programId={programId} />
		</div>
	);
};
export const ProgramPage: FC<{
	programSlug: string;
	collegeSlug: string;
}> = async ({ programSlug, collegeSlug }) => {
	const program = await api.program.getBySlug({
		programSlug,
		collegeSlug
	});

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader
				collegeSlug={collegeSlug}
				collegeName={program.college.name}
				topicName={program.name}
			/>
			{/* <SummarySection /> */}
			<Tabs defaultValue="discussion">
				<TabsList>
					<TabsTrigger value="discussion">Rasprava</TabsTrigger>
					<TabsTrigger value="subjects">Predmeti</TabsTrigger>
				</TabsList>
				<TabsContent value="discussion">
					<DiscussionTab
						programId={program.id}
						collegeId={program.college.id}
					/>
				</TabsContent>
				<TabsContent value="subjects">
					<SubjectsTab programId={program.id} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};
