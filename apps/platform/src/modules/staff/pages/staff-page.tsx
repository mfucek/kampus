import { Container } from '@/global/components/container';
import { api } from '@/lib/trpc/server';
import { PageHeader } from '@/modules/college/components/page-header';
import { Composer } from '@/modules/discussion/components/composer';
import { Post } from '@/modules/discussion/components/post';
import { SummarySection } from '@/modules/summary/components/summary-section';
import type { FC } from 'react';

export const StaffPage: FC<{
	staffSlug: string;
	collegeSlug: string;
}> = async ({ staffSlug, collegeSlug }) => {
	const staff = await api.staff.getBySlug({ staffSlug, collegeSlug });

	return (
		<Container className="flex flex-col gap-10 py-10">
			<PageHeader
				collegeSlug={collegeSlug}
				collegeName={staff.college.name}
				topicName={staff.name}
			/>
			<SummarySection />
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
		</Container>
	);
};
