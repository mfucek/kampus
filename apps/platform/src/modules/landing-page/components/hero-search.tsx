'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, type FC } from 'react';

import { Icon, IconName } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { ListAllCollegesItem } from '@/modules/topic/college/api/procedures/list-all';
import { type ListTopCollegesItem } from '@/modules/topic/college/api/procedures/list-top-colleges';
import Image from 'next/image';

const CollegeCard: FC<{
	college: ListTopCollegesItem;
	fallbackIcon?: IconName;
}> = ({ college, fallbackIcon = 'book-open' }) => {
	return (
		<Link href={college.link}>
			<Button
				variant="ghost"
				theme="neutral"
				size="lg"
				className="justify-start px-4 hover:md:bg-theme-weak w-full"
			>
				<div className="w-6 h-6 flex items-center justify-center bg-neutral-weak rounded-md shrink-0 relative">
					<Icon icon={fallbackIcon} className="!bg-neutral-strong" size={16} />
					{college.iconSrc && (
						<Image
							src={college.iconSrc}
							alt={college.name}
							fill
							className="object-cover"
						/>
					)}
				</div>
				<div className="flex flex-col text-left w-full overflow-hidden">
					<p className="button-md w-full truncate">{college.name}</p>
					<p className="text-neutral-strong caption">{college.slug}</p>
				</div>
			</Button>
		</Link>
	);
};

export const HeroSearch: FC<{
	topColleges: ListTopCollegesItem[];
	allColleges: ListAllCollegesItem[];
}> = ({ topColleges, allColleges }) => {
	const { isSignedIn } = useAuth();
	const { openSignUp } = useClerk();

	const [search, setSearch] = useState('');

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	if (isSignedIn) {
		<Link href="/colleges">
			<Button>Idi na platformu</Button>
		</Link>;
	}

	<>
		<Button
			onClick={() => openSignUp({ afterSignInUrl: '/colleges' })}
			theme="accent"
			size="md"
			variant="solid"
		>
			Pridruži se besplatno
		</Button>
		<Button onClick={() => scrollToSection('features')} variant="outline">
			Saznaj više
		</Button>
	</>;

	const SearchResults = () => {
		return (
			<div className="flex flex-row bg-section rounded-2xl overflow-hidden">
				<div className="flex flex-col gap-3 flex-1 py-4 overflow-hidden">
					<div className="flex flex-row justify-between px-4">
						<p className="title-3 text-neutral-strong">
							Rezultati za: {search}
						</p>
					</div>

					<div className="flex flex-col px-1 lg:min-h-[156px]">
						{allColleges
							.filter(
								(college) =>
									college.name.toLowerCase().includes(search.toLowerCase()) ||
									college.slug.toLowerCase().includes(search.toLowerCase())
							)
							.map((college) => (
								<CollegeCard key={college.id} college={college} />
							))}
					</div>
				</div>
			</div>
		);
	};

	const DefaultResults = () => {
		return (
			<div className="flex flex-col-reverse md:flex-row bg-section rounded-2xl overflow-hidden">
				<div className="flex flex-col gap-3 flex-1 py-4 overflow-hidden">
					<div className="flex flex-row justify-between px-4">
						<p className="title-3">Top fakulteti</p>
						<Link
							className="text-accent hover:underline button-md"
							href="/colleges"
						>
							Vidi sve
						</Link>
					</div>

					<div className="flex flex-col px-1 h-full">
						{topColleges.map((college) => (
							<CollegeCard key={college.id} college={college} />
						))}
					</div>
				</div>

				<div className="flex px-4 py-0 md:py-4 md:px-0">
					<div className="w-full md:w-px h-px md:h-full bg-neutral-weak" />
				</div>

				<div className="flex flex-col gap-3 flex-1 py-4 overflow-hidden">
					<div className="flex flex-row justify-between px-4">
						<p className="title-3">Nedavno pregledano</p>
						<a className="text-accent hover:underline button-md" href="#">
							Očisti
						</a>
					</div>

					<div className="flex flex-col px-1 h-full">
						<div className="flex-1 flex justify-center items-center body-3 text-neutral-strong">
							Ova funkcionalnost dolazi uskoro!
						</div>
						{/* {topColleges.map((college) => (
							<CollegeCard key={college.id} college={college} />
						))} */}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-2 px-2 lg:px-0">
			<div className="flex flex-row items-center h-12 bg-foreground border border-neutral-weak rounded-full">
				<input
					className="input bg-transparent h-full px-4 flex-1 outline-none"
					type="text"
					placeholder="Traži fakultete... (uskoro profesore, predmete)"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div className="px-4">
					<Icon icon="search" className="bg-neutral-strong" />
				</div>
			</div>

			{search ? <SearchResults /> : <DefaultResults />}
		</div>
	);
};
