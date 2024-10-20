'use client';

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/lib/shadcn/ui/tooltip';

import { Icon } from '@/global/components/icon';
import { cn } from '@/lib/shadcn/utils';
import { useEffect, useRef, useState } from 'react';
import { Sentiment, SummaryCard } from './summary-card';

const exampleData: {
	title: string;
	body: string;
	sentiment: Sentiment;
}[] = [
	{
		title: 'Pozitivan sentiment',
		body: 'Ljudi generalno kazu da je ovaj predmet relativno lagan i da ima zeznute ispite, ali uz pracenje nastave da se da proc.',
		sentiment: 'positive'
	},
	{
		title: 'Oprezno s labosima',
		body: 'Provjeravaju kod s Plagscanom, pa se paziti pri predaji. Nekoliko ljudi je dobilo opomenu.',
		sentiment: 'warning'
	},
	{
		title: 'Profesori susretljivi',
		body: 'Ful susretljivi profesori',
		sentiment: 'positive'
	},
	{
		title: 'Rokovi su brutalno teski',
		body: 'Mnogi preporučuju da se s pripremama krene barem mjesec dana ranije. Posebno su teški zadaci s programiranjem.',
		sentiment: 'negative'
	}
];

const SectionTitle = ({
	title,
	tooltip
}: {
	title: string;
	tooltip?: string;
}) => {
	return (
		<div className="flex flex-row gap-1">
			<h3 className="title-3">{title}</h3>
			{tooltip && (
				<Tooltip>
					<TooltipTrigger>
						<Icon icon="status-info" size={16} className="bg-neutral-strong" />
					</TooltipTrigger>
					<TooltipContent>{tooltip}</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
};

export const SummarySection = () => {
	const ref = useRef<HTMLDivElement>(null);

	const [showLeftFade, setShowLeftFade] = useState(false);
	const [showRightFade, setShowRightFade] = useState(false);

	const updateFades = () => {
		if (ref.current) {
			const { scrollLeft, scrollWidth, clientWidth } = ref.current;
			setShowLeftFade(scrollLeft > 0);
			setShowRightFade(scrollLeft < scrollWidth - clientWidth - 1); // -1 to account for potential rounding errors
		}
	};

	useEffect(() => {
		updateFades();
		const scrollContainer = ref.current;
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', updateFades);
		}
		return () => {
			if (scrollContainer) {
				scrollContainer.removeEventListener('scroll', updateFades);
			}
		};
	}, []);

	return (
		<div className="flex flex-col gap-2">
			<SectionTitle title="Sazetak" tooltip="This is a tooltip" />

			<div className="w-full relative flex flex-row">
				<div
					className="flex flex-row gap-2 relative overflow-x-scroll overflow-hidden"
					ref={ref}
				>
					{exampleData.map((item, index) => (
						<SummaryCard key={index} {...item} />
					))}
				</div>

				<div
					className={cn(
						showRightFade ? 'opacity-100' : 'opacity-0',
						'duration-100 w-10 h-full absolute top-0 right-0 bg-gradient-to-r from-transparent to-section pointer-events-none'
					)}
				/>

				<div
					className={cn(
						showLeftFade ? 'opacity-100' : 'opacity-0',
						'duration-100 w-10 h-full absolute top-0 left-0 bg-gradient-to-l from-transparent to-section pointer-events-none'
					)}
				/>
			</div>
		</div>
	);
};
