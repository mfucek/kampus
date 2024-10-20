import { Container } from '@/global/components/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn/ui/tabs';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { MaterialsTable } from '@/modules/materials/components/materials-table';
import { StaffsTable } from '@/modules/staff/components/staffs-table';
import { SummarySection } from '@/modules/summary/components/summary-section';
import type { FC } from 'react';

export const SubjectPage: FC<{ subjectSlug: string; collegeSlug: string }> = ({
	subjectSlug,
	collegeSlug
}) => {
	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader collegeSlug={collegeSlug} topicSlug={subjectSlug} />
			<SummarySection />
			<Tabs defaultValue="discussion">
				<TabsList>
					<TabsTrigger value="discussion">Rasprava</TabsTrigger>
					<TabsTrigger value="materials">Materijali</TabsTrigger>
					<TabsTrigger value="staff">Profesori</TabsTrigger>
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
				<TabsContent value="materials">
					<MaterialsTable />
				</TabsContent>
				<TabsContent value="staff">
					<StaffsTable />
				</TabsContent>
			</Tabs>
		</Container>
	);
};
