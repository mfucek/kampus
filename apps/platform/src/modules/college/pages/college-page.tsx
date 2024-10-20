import { Container } from '@/global/components/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn/ui/tabs';
import { api } from '@/lib/trpc/server';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { StaffsTable } from '@/modules/staff/components/staffs-table';
import { SubjectsTable } from '@/modules/subject/components/subjects-table';
import type { FC } from 'react';

export const CollegePage: FC<{ collegeSlug: string }> = async ({
	collegeSlug
}) => {
	const college = await api.college.getBySlug({ collegeSlug });

	const subjects = await api.subject.listByCollegeSlug({ collegeSlug });
	const staffs = await api.staff.listByCollegeSlug({ collegeSlug });

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader collegeSlug={collegeSlug} collegeName={college.name} />

			<Tabs defaultValue="discussion">
				<TabsList>
					<TabsTrigger value="discussion">Opca Rasprava</TabsTrigger>
					<TabsTrigger value="subjects">Popis Predmeta</TabsTrigger>
					<TabsTrigger value="staff">Svi Profesori</TabsTrigger>
				</TabsList>
				<TabsContent value="discussion">
					<div className="flex flex-col gap-10">
						<Composer />
						<div className="flex flex-col">
							<Post
								content={{
									type: 'doc',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'U JNA su većina visokopozicioniranih oficira bili Srbi. Zato su tako lako i preuzeli kontrolu nad JNA u 91. Srbi i polupismeni Crnogorci su upadali u vojne škole bez ikakvih problema. U isto vrijeme su Hrvati morali prolaziti rigorozne testove znanja i fizičke spreme da bi upali u te iste škole. Pričam iz iskustva.'
												}
											]
										}
									]
								}}
							/>

							<Post
								content={{
									type: 'doc',
									content: [
										{
											type: 'paragraph',
											content: [
												{
													type: 'text',
													text: 'U JNA su većina visokopozicioniranih oficira bili Srbi. Zato su tako lako i preuzeli kontrolu nad JNA u 91. Srbi i polupismeni Crnogorci su upadali u vojne škole bez ikakvih problema. U isto vrijeme su Hrvati morali prolaziti rigorozne testove znanja i fizičke spreme da bi upali u te iste škole. Pričam iz iskustva.'
												}
											]
										}
									]
								}}
							/>
						</div>
					</div>
				</TabsContent>
				<TabsContent value="subjects">
					<SubjectsTable subjects={subjects} />
				</TabsContent>
				<TabsContent value="staff">
					<StaffsTable staffs={staffs} />
				</TabsContent>
			</Tabs>
		</Container>
	);
};
