// 'use client';

// import Link from 'next/link';
// import { useState, type FC } from 'react';

// import { Icon, type IconName } from '@/global/components/icon';
// import { SectionList } from '@/global/components/section-list';
// import { ContentPadding } from '@/global/layouts/content-padding';
// import { Button } from '@/lib/shadcn/ui/button';
// import { type CollegesListItem } from '@/modules/topic/api/procedures/college/list-all';
// import { type ListTopCollegesItem } from '@/modules/topic/api/procedures/college/list-top-colleges';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';

// const CollegeCard: FC<{
// 	college: ListTopCollegesItem;
// 	fallbackIcon?: IconName;
// }> = ({ college, fallbackIcon = 'book-open' }) => {
// 	return (
// 		<Link href={college.link}>
// 			<Button
// 				variant="ghost"
// 				theme="neutral"
// 				size="lg"
// 				className="justify-start px-4 hover:md:bg-theme-weak w-full"
// 			>
// 				<div className="w-6 h-6 flex flex-col items-center justify-center bg-neutral-weak rounded-md overflow-hidden border border-neutral-weak shrink-0 relative">
// 					<Icon icon={fallbackIcon} className="!bg-neutral-strong" size={16} />
// 					{college.iconSrc && (
// 						<Image
// 							src={college.iconSrc}
// 							alt={college.name}
// 							fill
// 							className="object-cover"
// 						/>
// 					)}
// 				</div>
// 				<div className="flex flex-col text-left w-full overflow-hidden">
// 					<p className="button-md w-full truncate">{college.name}</p>
// 					<p className="text-neutral-strong caption">{college.slug}</p>
// 				</div>
// 			</Button>
// 		</Link>
// 	);
// };

// export const HeroSearch: FC<{
// 	topColleges: ListTopCollegesItem[];
// 	allColleges: CollegesListItem[];
// }> = ({ topColleges, allColleges }) => {
// 	const pathname = usePathname();

// 	const [search, setSearch] = useState('');

// 	const scrollToSection = (id: string) => {
// 		const element = document.getElementById(id);
// 		if (element) {
// 			element.scrollIntoView({ behavior: 'smooth' });
// 		}
// 	};

// 	const searchFilteredColleges = allColleges
// 		.filter(
// 			(college) =>
// 				college.name.toLowerCase().includes(search.toLowerCase()) ||
// 				college.slug.toLowerCase().includes(search.toLowerCase())
// 		)
// 		.filter((_, index) => index < 3);

// 	// if (isSignedIn) {
// 	// 	<Link href="/colleges">
// 	// 		<Button>Idi na platformu</Button>
// 	// 	</Link>;
// 	// }

// 	<>
// 		<Button
// 			// onClick={() => openSignUp({ afterSignInUrl: pathname })}
// 			theme="accent"
// 			size="md"
// 			variant="solid"
// 		>
// 			Pridruži se besplatno
// 		</Button>
// 		<Button onClick={() => scrollToSection('features')} variant="outline">
// 			Saznaj više
// 		</Button>
// 	</>;

// 	const SearchResults = () => {
// 		return (
// 			<div className="flex flex-row bg-section rounded-2xl overflow-hidden">
// 				<div className="flex flex-col gap-3 flex-1 py-4 overflow-hidden">
// 					<div className="flex flex-row justify-between px-4">
// 						<p className="title-3 text-neutral-strong">
// 							Rezultati za: {search}
// 						</p>
// 					</div>

// 					<div className="flex flex-col px-1 lg:min-h-[156px]">
// 						{searchFilteredColleges.map((college) => (
// 							<CollegeCard key={college.id} college={college} />
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	};

// 	const DefaultResults = () => {
// 		return (
// 			<div className="flex flex-col-reverse md:flex-row bg-section rounded-2xl overflow-hidden">
// 				<div className="flex flex-col gap-3 flex-1 py-4 overflow-hidden">
// 					<div className="flex flex-row justify-between px-4">
// 						<p className="title-3 hello">Top fakulteti</p>
// 						<Link
// 							className="text-accent hover:underline button-md"
// 							href="/colleges"
// 						>
// 							Vidi sve
// 						</Link>
// 					</div>

// 					<div className="flex flex-col px-1 h-full lg:min-h-[156px]">
// 						{topColleges.map((college) => (
// 							<CollegeCard key={college.id} college={college} />
// 						))}
// 					</div>
// 				</div>

// 				<div className="flex px-4 py-0 md:py-4 md:px-0">
// 					<div className="w-full md:w-px h-px md:h-full bg-neutral-weak" />
// 				</div>

// 				<div className="flex flex-col gap-3 flex-1 py-4 overflow-hidden">
// 					<div className="flex flex-row justify-between px-4">
// 						<p className="title-3">Nedavno pregledano</p>
// 						<a className="text-accent hover:underline button-md" href="#">
// 							Očisti
// 						</a>
// 					</div>

// 					<div className="flex flex-col px-1 h-full">
// 						<div className="flex-1 flex justify-center items-center body-3 text-neutral-strong">
// 							Ova funkcionalnost dolazi uskoro!
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	};

// 	return (
// 		<>
// 			<ContentPadding size="sm">
// 				<div className="flex flex-row items-center h-12 bg-section border border-neutral-weak rounded-full">
// 					<input
// 						className="input bg-transparent h-full px-4 flex-1 outline-none"
// 						type="text"
// 						placeholder="Traži fakultete..."
// 						value={search}
// 						onChange={(e) => setSearch(e.target.value)}
// 					/>
// 					<div className="px-4">
// 						<Icon icon="search" className="bg-neutral-strong" />
// 					</div>
// 				</div>
// 			</ContentPadding>

// 			<div className="hidden md:block">
// 				<ContentPadding size="sm">
// 					{search ? <SearchResults /> : <DefaultResults />}
// 				</ContentPadding>
// 			</div>

// 			<div className="block md:hidden">
// 				<SectionList
// 					data={search ? searchFilteredColleges : topColleges}
// 					rows={(college) => (
// 						<>
// 							<div className="w-6 h-6 flex flex-col items-center justify-center bg-neutral-weak border border-neutral-weak rounded-md overflow-hidden shrink-0 relative">
// 								<Icon
// 									icon="book-open"
// 									className="!bg-neutral-strong"
// 									size={16}
// 								/>
// 								{college.iconSrc && (
// 									<Image
// 										src={college.iconSrc}
// 										alt={college.name}
// 										fill
// 										className="object-cover"
// 									/>
// 								)}
// 							</div>
// 							<div className="flex flex-col text-left w-full overflow-hidden">
// 								<p className="button-md w-full truncate">{college.name}</p>
// 								<p className="text-neutral-strong caption">{college.slug}</p>
// 							</div>
// 						</>
// 					)}
// 					emptyRow={<>Nema fakulteta</>}
// 					title={search ? 'Rezultati za: ' + search : 'Top fakulteti'}
// 					info={
// 						<Link href="/colleges" className="text-accent">
// 							Vidi sve
// 						</Link>
// 					}
// 				/>
// 			</div>
// 		</>
// 	);
// };
