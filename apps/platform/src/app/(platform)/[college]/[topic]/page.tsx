import { Container } from '@/global/components/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/shadcn/ui/tabs';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { SummarySection } from '@/modules/summary/components/summary-section';
import type { FC } from 'react';

interface PageProps {
	params: {
		college: string;
		topic: string;
	};
}

const Page: FC<PageProps> = ({ params }) => {
	const { topic, college } = params;

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader
				title={college}
				subtitle={topic}
				icon="https://picsum.photos/48/48"
			/>
			<SummarySection />
			<Tabs defaultValue="discussion">
				<TabsList>
					<TabsTrigger value="discussion">Rasprava</TabsTrigger>
					<TabsTrigger value="subjects">Materijali</TabsTrigger>
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
				<TabsContent value="subjects">Predmeti</TabsContent>
				<TabsContent value="staff">Profesori</TabsContent>
			</Tabs>
		</Container>
	);
};

export default Page;
