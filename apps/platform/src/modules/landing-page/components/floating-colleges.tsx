'use client';

import { Container } from '@/global/components/container';
import { Icon } from '@/global/components/icon';
import { Badge } from '@/lib/shadcn/ui/badge';
import { cn } from '@/lib/shadcn/utils';
import { type CollegesListItem } from '@/modules/topic/api/procedures/college/list-all';
import Image from 'next/image';
import Link from 'next/link';
import { type FC, useEffect, useMemo, useState } from 'react';

type Point = {
	anchor: 'left' | 'right';
	x: number;
	y: number;
	z: number;
};

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const FloatingColleges: FC<{ allColleges: CollegesListItem[] }> = ({
	allColleges
}) => {
	const positions = useMemo(() => {
		const points: Point[] = [];

		const anchorRangeY = 400;
		const numberOfPoints = 4;

		const rangeX = 120;
		const rangeY = 20;
		const rangeZ = 1;

		for (let i = 0; i < numberOfPoints; i++) {
			const anchorY =
				-anchorRangeY / 2 + (anchorRangeY / (numberOfPoints - 1)) * i;

			const displacementX = random(-rangeX / 2, rangeX / 2);
			const displacementY = random(-rangeY / 2, rangeY / 2);
			const displacementZ = random(-rangeZ, 0.0);

			points.push({
				anchor: 'left',
				x: displacementX,
				y: anchorY + displacementY,
				z: displacementZ
			});
		}
		for (let i = 0; i < numberOfPoints; i++) {
			const anchorY =
				-anchorRangeY / 2 + (anchorRangeY / (numberOfPoints - 1)) * i;

			const displacementX = random(-rangeX / 2, rangeX / 2);
			const displacementY = random(-rangeY / 2, rangeY / 2);
			const displacementZ = random(-rangeZ, 0);

			points.push({
				anchor: 'right',
				x: displacementX,
				y: anchorY + displacementY,
				z: displacementZ
			});
		}

		return points;
	}, []);

	const [gyroOffset, setGyroOffset] = useState({ x: 0, y: 0 });
	const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

	const offset = {
		x: 0, //mouseOffset.x,
		y: 0 //mouseOffset.y
	};

	useEffect(() => {
		const handleGyro = (event: DeviceOrientationEvent) => {
			setGyroOffset({
				x: (event.alpha ?? 0) * 0.1,
				y: (event.beta ?? 0) * 0.1
			});
		};

		const handleMouseMove = (event: MouseEvent) => {
			setMouseOffset({
				x: (event.clientX - window.innerWidth / 2) * 0.05,
				y: (event.clientY - window.innerHeight / 2) * 0.05
			});
		};

		window.addEventListener('deviceorientation', handleGyro);
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('deviceorientation', handleGyro);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<Container
			size="xl"
			className="absolute top-0 h-full overflow-hidden [@media(min-width:1600px)]:overflow-visible hidden xl:block"
		>
			{positions.map((position, i) => (
				<div
					key={i}
					className={cn(
						'absolute duration-300 hover:duration-100 hover:!scale-100 hover:!opacity-100 scale-100 hover:!filter-none'
					)}
					style={{
						top: `calc(50% - ${position.y}px)`,
						...(position.anchor === 'left'
							? { left: `${position.x}px` }
							: { right: `${position.x}px` }),
						perspective: '1000px',
						transformStyle: 'preserve-3d',
						opacity: 1 + position.z * 0.2,
						// @ts-expect-error setting variable
						'--tw-scale-x': 1 + position.z * 0.2,
						'--tw-scale-y': 1 + position.z * 0.2,
						'--tw-translate-x': `calc(${offset.x * (1 + position.z)}px)`,
						'--tw-translate-y': `calc(${offset.y * (1 + position.z)}px)`,
						// scale: 1 + position.z * 0.2,
						filter: `blur(${-position.z * 2}px)`,
						zIndex: 10 + Math.floor(position.z * 10)
					}}
					suppressHydrationWarning={true}
				>
					<Link href={allColleges[i % allColleges.length]!.link}>
						<div className="w-[240px] p-4 gap-2 bg-section flex flex-col rounded-xl border border-neutral-weak cursor-pointer">
							<div className="flex flex-row gap-2 items-center">
								<div className="w-6 h-6 rounded-md bg-neutral-weak shrink-0">
									{allColleges[i % allColleges.length]?.iconSrc && (
										<Image
											src={allColleges[i % allColleges.length]?.iconSrc ?? ''}
											alt={allColleges[i % allColleges.length]?.name ?? ''}
											width={24}
											height={24}
											className="w-full h-full object-fill"
										/>
									)}
								</div>
								<div className="title-3">
									{allColleges[i % allColleges.length]?.name}
								</div>
							</div>
							<div className="flex flex-row gap-2">
								<Badge
									theme="neutral"
									variant="secondary"
									className="rounded-full"
								>
									<div className="w-4 h-4 rounded-full bg-accent-medium p-1">
										<div className="w-2 h-2 rounded-full bg-accent" />
									</div>
									<span className="text-accent">
										{allColleges[i % allColleges.length]?.postCount} objava
									</span>
								</Badge>
								<Badge
									theme="neutral"
									variant="secondary"
									className="rounded-full"
								>
									<Icon icon="users" className="bg-accent" size={16} />
									<span className="text-accent">24</span>
								</Badge>
							</div>
						</div>
					</Link>
				</div>
			))}
		</Container>
	);
};
