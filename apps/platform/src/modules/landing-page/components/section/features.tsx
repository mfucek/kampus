'use client';

import { Container } from '@/global/components/container';
import { Icon } from '@/global/components/icon';

import { IconSizeContext } from '@/lib/shadcn/ui/button';
import { type FC, type PropsWithChildren } from 'react';

const Card: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="p-8 rounded-2xl bg-section border border-neutral-weak flex flex-col gap-4 justify-between">
			{children}
		</div>
	);
};

const CardHeader: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="flex flex-col gap-2 mb-2">
			<IconSizeContext.Provider value={24}>{children}</IconSizeContext.Provider>
		</div>
	);
};

const CardTitle: FC<PropsWithChildren> = ({ children }) => {
	return <div className="flex flex-row gap-2 title-2">{children}</div>;
};

const CardContent: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className="flex flex-col gap-4 body-1 text-neutral">{children}</div>
	);
};

export const FeaturesSection = () => {
	return (
		<section
			id="features"
			className="flex flex-col gap-10 items-center py-20 bg-section rounded-2xl md:rounded-3xl overflow-hidden"
		>
			<Container size="sm" className="gap-6 px-3 md:px-6">
				<h2 className="display-2 text-center">Zašto Kampus.hr?</h2>
				<p className="body-1 text-center text-neutral-strong">
					Tvoj virtualni kampus za razmjenu znanja, iskustava i materijala.
					Spojimo sve studente u Hrvatskoj!
				</p>
			</Container>

			<Container size="lg" className="gap-10 px-3 md:px-6 relative">
				<div className="grid gap-2 md:grid-cols-3 z-10">
					<Card>
						<CardContent>
							<CardHeader>
								<CardTitle>
									<Icon icon="chat-single" />
									Forumi za svaki faks
								</CardTitle>
							</CardHeader>
							Posebni forumi za svaki fakultet, profesora i predmet. Raspravljaj
							o svemu što te zanima!
						</CardContent>
					</Card>
					<Card>
						<CardContent>
							<CardHeader>
								<CardTitle>
									<Icon icon="file-textual" />
									Dijeljenje materijala
								</CardTitle>
							</CardHeader>
							Dijeli i preuzimaj skripte, riješene ispite i ostale korisne
							materijale za učenje.
						</CardContent>
					</Card>
					<Card>
						<CardContent>
							<CardHeader>
								<CardTitle>
									<Icon icon="users" />
									Studentska zajednica
								</CardTitle>
							</CardHeader>
							Poveži se s kolegama, razmjenjuj iskustva i pronađi podršku u
							studentskoj zajednici.
						</CardContent>
					</Card>
				</div>
				<div className="w-[400px] h-[160px] bg-accent opacity-25 rounded-[100%] blur-[120px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
			</Container>
		</section>
	);
};
