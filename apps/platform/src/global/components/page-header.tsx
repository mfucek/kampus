'use client';

import { useViewportSize } from '@/deps/viewport-size';
import { Badge } from '@/lib/shadcn/ui/badge';
import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ContentPadding } from '../layouts/content-padding';
import { Icon } from './icon';

export const PageHeader = ({
	title,
	tags = [],
	imageSrc
}: {
	title: string;
	tags?: string[];
	imageSrc?: string;
}) => {
	const [_floatingVisible, setFloatingVisible] = useState(false);
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			setFloatingVisible(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const router = useRouter();
	const { isMobile } = useViewportSize();

	return (
		<>
			<ContentPadding size="lg" className={cn(isMobile && 'pl-0')}>
				<div className="flex flex-row items-center" ref={elementRef}>
					<Button
						variant="ghost"
						size="lg"
						className="shrink-0 h-full block md:hidden"
						onClick={() => router.back()}
					>
						<Icon icon="arrow-left" />
					</Button>
					{imageSrc && (
						<div className="w-[72px] h-[96px] md:w-[120px] md:h-[160px] bg-section md:bg-neutral-weak rounded-xl overflow-hidden mr-4 md:mr-6">
							<Image src={imageSrc} alt={title} fill className="object-cover" />
						</div>
					)}
					<div className="flex flex-col flex-1 gap-2">
						<div className="flex flex-wrap">
							{tags.map((tag) => (
								<Badge key={tag} variant="tertiary" theme="neutral">
									{tag}
								</Badge>
							))}
						</div>
						<div className="display-3">{title}</div>
					</div>
				</div>
			</ContentPadding>
			{/* <div
				className={cn(
					'fixed top-0 left-0 right-0 md:hidden block',
					'bg-section/90 border-b border-neutral-weak backdrop-blur-sm',
					'z-10',
					'flex',
					'duration-300 translate-y-[-100%]',
					floatingVisible && 'translate-y-0'
				)}
			>
				<SmallContent />
			</div> */}
		</>
	);
};

export const PageHeaderSkeleton = () => {
	return (
		<ContentPadding size="lg">
			<div className="flex flex-row gap-2">
				<div className="flex flex-col gap-2">
					<div className="flex flex-wrap">
						<Badge variant="tertiary" theme="neutral">
							<div className="w-20"></div>
						</Badge>
						<Badge variant="tertiary" theme="neutral">
							<div className="w-10"></div>
						</Badge>
					</div>
					<div className="w-40 h-[32px] rounded-md bg-neutral-medium" />
				</div>
				<div className="w-20 h-40 bg-red-500">asd</div>
			</div>
		</ContentPadding>
	);
};
