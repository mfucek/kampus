'use client';

import { FC, PropsWithChildren } from 'react';

import { SectionList } from '@/global/components/section-list';
import { Button } from '@/lib/shadcn/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/lib/shadcn/ui/select';
import { api } from '@/lib/trpc/react';

const Section: FC<
	PropsWithChildren & {
		title: string;
		description?: string;
		id?: string;
	}
> = ({ children, title, description, id }) => {
	return (
		<div className="flex flex-col @sm:flex-row gap-10" id={id}>
			<div className="flex flex-col gap-2 @sm:w-[400px]">
				<p className="title-3 text-neutral">{title}</p>
				<p className="body-2 text-neutral-strong">{description}</p>
			</div>
			<div className="flex flex-col gap-10 flex-1">{children}</div>
		</div>
	);
};

const Divider = () => {
	return <div className="w-full h-[1px] bg-neutral-weak" />;
};

export const CollegeMassUploader = ({ collegeId }: { collegeId: string }) => {
	const { data: subjects } = api.subject.list.useQuery({
		scope: {
			collegeId: collegeId
		}
	});

	const subjectsSorted = (subjects?.subjects ?? []).sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	return (
		<div className="flex flex-col gap-10">
			<Section
				title="1. Pripremi materijale"
				description="Iz proizvoljnog izvora pronadi sve materijale koje smatras korisnima: skripte, ispite, popise zadataka, itd."
			/>

			<Divider />
			<Section
				title="2. Odaberi predmet"
				description="U izborniku desno odaberi predmet"
			>
				<div className="flex flex-row flex-1 justify-end gap-2">
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Select a subject" />
						</SelectTrigger>
						<SelectContent>
							{subjectsSorted.sort().map((s) => (
								<SelectItem key={s.id} value={s.id}>
									{s.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</Section>

			<Divider />

			<Section
				title="3. Prenesi materijale"
				description={`Dovuci dokumente u popis dolje, dodaj kategoriju na svaki dokument i, ako ima smisla, dodaj akademsku godinu (npr. za ispite). Ako nedostaje neka kategorija javi mi se, pa ju dodamo!`}
			>
				<div className="flex flex-row flex-1 justify-end gap-2">
					<Button size="md" variant="solid-weak" rounded>
						Dodaj materijale
					</Button>
					<Button size="md" variant="solid" rounded>
						Prenesi sve
					</Button>
				</div>
			</Section>

			<SectionList
				data={subjectsSorted}
				rows={(item) => <div className="body-2">{item.name}</div>}
				title="Dokumenti"
				info={`${subjectsSorted.length} dokumenata`}
			/>
		</div>
	);
};
