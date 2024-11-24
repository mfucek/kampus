import { Container } from '@/global/components/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn/ui/tabs';
import { api } from '@/lib/trpc/server';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/composer/components';
import { DocumentsTableAdvanced } from '@/modules/file/components/documents-table-advanced';
import { InfiniteScrollTopLevelPosts } from '@/modules/post/components/infinite-scroll-top-level-posts';
import { StaffsTableAdvanced } from '@/modules/staff/components/staffs-table-advanced';
import type { FC } from 'react';

const DiscussionTab: FC<{
	subjectId: string;
	subjectSlug: string;
	collegeSlug: string;
	collegeId: string;
}> = async ({ subjectId, collegeId }) => {
	return (
		<div className="flex flex-col gap-10">
			<Composer collegeId={collegeId} topicId={subjectId} />
			<InfiniteScrollTopLevelPosts scope={{ topic: { id: subjectId } }} />
		</div>
	);
};

const MaterialsTab: FC<{ subjectId: string }> = async ({ subjectId }) => {
	return <DocumentsTableAdvanced scope={{ topicId: subjectId }} />;
};

const StaffTab: FC<{ subjectId: string }> = async ({ subjectId }) => {
	return <StaffsTableAdvanced scope={{ subjectId }} />;
};

export const SubjectPage: FC<{
	subjectSlug: string;
	collegeSlug: string;
}> = async ({ subjectSlug, collegeSlug }) => {
	const subject = await api.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader
				collegeSlug={collegeSlug}
				collegeName={subject.college.name}
				topicName={subject.name}
			/>
			{/* <SummarySection /> */}
			<Tabs defaultValue="discussion">
				<TabsList>
					<TabsTrigger value="discussion">Rasprava</TabsTrigger>
					<TabsTrigger value="materials">Materijali</TabsTrigger>
					<TabsTrigger value="staff">Profesori</TabsTrigger>
				</TabsList>
				<TabsContent value="discussion">
					<DiscussionTab
						subjectId={subject.id}
						subjectSlug={subjectSlug}
						collegeSlug={collegeSlug}
						collegeId={subject.college.id}
					/>
				</TabsContent>
				<TabsContent value="materials">
					<MaterialsTab subjectId={subject.id} />
				</TabsContent>
				<TabsContent value="staff">
					<StaffTab subjectId={subject.id} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};
