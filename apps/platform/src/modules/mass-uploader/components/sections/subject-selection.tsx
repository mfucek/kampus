'use client';

import { Icon } from '@/global/components/icon';
import { Section } from '@/global/components/section';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Button } from '@/lib/shadcn/ui/button';
import { type SubjectListItem } from '@/modules/topic/subject/api/procedures/list';

import { Combobox } from '@/lib/shadcn/ui/combobox';

export const SubjectSelectionSection = ({
	subjects,
	subject,
	setSubject
}: {
	subjects: SubjectListItem[];
	subject: SubjectListItem | null;
	setSubject: (subject: SubjectListItem | null) => void;
}) => {
	return (
		<ContentPadding>
			<Section
				title="2. Odaberi predmet"
				description="U izborniku desno odaberi predmet"
			>
				<div className="flex flex-row flex-1 justify-end gap-2">
					<Combobox
						values={subjects}
						value={subject}
						onChange={(subject) => setSubject(subject)}
						placeholder="Odaberi predmet..."
						makeKey={(s) => s.id}
						makeName={(s) => s.name}
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
			</Section>
		</ContentPadding>
	);
};
