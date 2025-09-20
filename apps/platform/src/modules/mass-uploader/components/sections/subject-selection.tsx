'use client';

import { api } from '@/deps/trpc/react';
import { Icon } from '@/global/components/icon';
import { Section } from '@/global/components/section';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Button } from '@/lib/shadcn/ui/button';
import { Combobox } from '@/lib/shadcn/ui/combobox';
import { type SubjectListItem } from '@/modules/topic/api/procedures/subject/list-paginated';

export const SubjectSelectionSection = ({
	subjects,
	subject,
	setSubject
}: {
	subjects: SubjectListItem[];
	subject: SubjectListItem | null;
	setSubject: (subject: SubjectListItem | null) => void;
}) => {
	const { data: subjectData } = api.topic.subject.getById.useQuery(
		{
			subjectId: subject?.subject?.topicId ?? ''
		},
		{
			enabled: !!subject?.subject?.topicId
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
							value={subject}
							onChange={(subject) => setSubject(subject)}
							placeholder="Odaberi predmet..."
							makeKey={(s) => s.id}
							makeName={(s) => s.name}
							className="w-full md:w-fit"
						/>
						{subject && (
							<a
								href={`/${subject.college.slug}/subject/${subject.slug}`}
								target="_blank"
							>
								<Button variant="outline" size="md" rounded iconOnly>
									<Icon icon="arrow-linked" />
								</Button>
							</a>
						)}
					</div>

					{subjectData && subjectData.numberOfDocuments > 0 && (
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
