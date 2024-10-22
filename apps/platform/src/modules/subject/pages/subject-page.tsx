import { Container } from '@/global/components/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn/ui/tabs';
import { api } from '@/lib/trpc/server';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { MaterialsTable } from '@/modules/materials/components/materials-table';
import { StaffsTable } from '@/modules/staff/components/staffs-table';
import { SummarySection } from '@/modules/summary/components/summary-section';
import type { FC } from 'react';

export const SubjectPage: FC<{
	subjectSlug: string;
	collegeSlug: string;
}> = async ({ subjectSlug, collegeSlug }) => {
	const subject = await api.subject.getBySlug({
		subjectSlug,
		collegeSlug
	});

	const staffs = await api.staff.listBySubjectId({
		subjectId: subject.id
	});

	const fullPosts = await api.post.getTopicPostsById({
		topicId: subject.id
	});

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader
				collegeSlug={collegeSlug}
				collegeName={subject.college.name}
				topicName={subject.name}
			/>
			<SummarySection />
			<Tabs defaultValue="discussion">
				<TabsList>
					<TabsTrigger value="discussion">Rasprava</TabsTrigger>
					<TabsTrigger value="materials">Materijali</TabsTrigger>
					<TabsTrigger value="staff">Profesori</TabsTrigger>
				</TabsList>
				<TabsContent value="discussion">
					<div className="flex flex-col gap-10">
						<Composer
							collegeId={subject.college.id}
							collegeSlug={collegeSlug}
							topicId={subject.id}
						/>
						<div className="flex flex-col">
							{fullPosts.map((fullPost) => (
								<Post
									key={fullPost.post.id}
									fullPost={fullPost}
									depthInfo={[]}
								/>
							))}
						</div>
					</div>
				</TabsContent>
				<TabsContent value="materials">
					<MaterialsTable />
				</TabsContent>
				<TabsContent value="staff">
					<StaffsTable staffs={staffs} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};
