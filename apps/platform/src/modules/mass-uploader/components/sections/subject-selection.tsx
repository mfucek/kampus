'use client';

import { Icon } from '@/global/components/icon';
import { Section } from '@/global/components/section';
import { ContentPadding } from '@/global/layouts/content-padding';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';
import { type SubjectListItem } from '@/modules/topic/subject/api/procedures/list';

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
					<Select
						value={subject?.id}
						onValueChange={(value) =>
							setSubject(subjects.find((s) => s.id === value) ?? null)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a subject" />
						</SelectTrigger>
						<SelectContent>
							{subjects.sort().map((s) => (
								<SelectItem key={s.id} value={s.id}>
									{s.name}{' '}
									<span className="text-neutral-strong">
										{`(${s.externalCode})`}
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
