'use client';

import { Container } from '@/global/components/container';
import { Icon } from '@/global/components/icon';
import { Badge } from '@/lib/shadcn/ui/badge';
import { Button } from '@/lib/shadcn/ui/button';
import { cn } from '@/lib/shadcn/utils';
import { useEffect, useMemo, useState } from 'react';

type Point = {
	anchor: 'left' | 'right';
	x: number;
	y: number;
	z: number;
};

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const FloatingIcons = () => {
	const positions = useMemo(() => {
		let points: Point[] = [];

		const rangeY = 400;
		const numberOfPoints = 4;

		for (let i = 0; i < numberOfPoints; i++) {
			const anchorY = -rangeY / 2 + (rangeY / (numberOfPoints - 1)) * i;

			const displacementX = random(-80, 80);
			const displacementY = random(-10, 10);
			const displacementZ = random(-1.0, 0.0);

			points.push({
				anchor: 'left',
				x: displacementX,
				y: anchorY + displacementY,
				z: displacementZ
			});
		}
		for (let i = 0; i < numberOfPoints; i++) {
			const anchorY = -rangeY / 2 + (rangeY / (numberOfPoints - 1)) * i;

			const displacementX = random(-80, 80);
			const displacementY = random(-10, 10);
			const displacementZ = random(-1, 0);

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
		x: mouseOffset.x,
		y: mouseOffset.y
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
		<>
			{positions.map((position, i) => (
				<div
					key={i}
					className={cn('absolute')}
					style={{
						top: `calc(50% - ${position.y}px)`,
						...(position.anchor === 'left'
							? { left: `${position.x}px` }
							: { right: `${position.x}px` }),
						perspective: '1000px',
						transformStyle: 'preserve-3d',
						transform: `translateY(calc(-50% + ${offset.y * (1 + position.z)}px)) translateX(${offset.x * (1 + position.z)}px)`,
						opacity: 1 + position.z * 0.1,
						scale: 1 + position.z * 0.2,
						filter: `blur(${-position.z * 2}px)`,
						zIndex: 2 + position.z
					}}
				>
					<div className="w-[200px] p-4 gap-2 bg-section flex flex-col rounded-xl border border-neutral-weak">
						<div className="flex flex-row gap-2 items-center">
							<div className="w-6 h-6 rounded-md bg-neutral-weak"></div>
							<div className="title-3">FER</div>
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
								<span className="text-accent">132 objava</span>
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
				</div>
			))}
		</>
	);
};

export const Test = () => {
	return (
		<section
			className="flex flex-col items-center py-40 bg-background relative overflow-hidden"
			id="hero"
		>
			<FloatingIcons />
			<Container>
				<div className="flex flex-col items-center space-y-4 text-center">
					<div className="flex flex-col items-center gap-6">
						<h1 className="display-1">Dobrodošli na Kampus.hr</h1>
						<p className="max-w-[640px] text-neutral-strong">
							Tvoj virtualni kampus za razmjenu znanja, iskustava i materijala.
							Spojimo sve studente u Hrvatskoj!
						</p>
					</div>
					<div className="flex flex-row gap-4">
						<Button theme="accent" size="md" variant="solid">
							Pridruži se besplatno
						</Button>
						<Button variant="outline">Saznaj više</Button>
					</div>
				</div>
			</Container>
		</section>
	);
};
