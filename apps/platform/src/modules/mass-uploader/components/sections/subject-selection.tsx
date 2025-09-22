'use client';

import { api } from '@/deps/trpc/react';
import { Icon } from '@/global/components/icon';
import { Section } from '@/global/components/section';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Button } from '@/lib/shadcn/ui/button';
import { Combobox } from '@/lib/shadcn/ui/combobox';

export interface ISubject {
	topic: {
		id: string;
		name: string;
	};
	link: string;
}

export const SubjectSelectionSection = ({
	subjects,
	selectedSubject,
	setSelectedSubject
}: {
	subjects: ISubject[];
	selectedSubject: ISubject | null;
	setSelectedSubject: (subject: ISubject | null) => void;
}) => {
	const subjectQuery = api.topic.subject.getById.useQuery(
		{
			topicId: selectedSubject?.topic.id ?? ''
		},
		{
			enabled: !!selectedSubject?.topic.id
		}
	);

	return (
		<ContentPadding>
			<Section
				title="2. Odaberi predmet"
				description="U izborniku desno odaberi predmet"
			>
				<div className="flex flex-col gap-3 flex-1">
					<div className="flex flex-row justify-end gap-2">
						<Combobox
							values={subjects}
							value={selectedSubject}
							onChange={(subject) => setSelectedSubject(subject ?? null)}
							placeholder="Odaberi predmet..."
							makeKey={(s) => s.topic.id}
							makeName={(s) => s.topic.name}
							className="w-full md:w-fit"
						/>
						{selectedSubject && (
							<a href={selectedSubject.link} target="_blank">
								<Button variant="outline" size="md" rounded iconOnly>
									<Icon icon="arrow-linked" />
								</Button>
							</a>
						)}
					</div>

					{subjectQuery.data && subjectQuery.data.documentsCount > 0 && (
						<div className="flex flex-row gap-2 p-3 bg-info-weak border border-info-medium text-info body-2 justify-center items-center rounded-lg">
							<Icon icon="status-info" className="bg-info" size={16} />
							Ovaj predmet već sadrži neke materijale.
						</div>
					)}
				</div>
			</Section>
		</ContentPadding>
	);
};
