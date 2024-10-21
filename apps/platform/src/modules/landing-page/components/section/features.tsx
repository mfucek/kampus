'use client';

import { Container } from '@/global/components/container';
import { Icon } from '@/global/components/icon';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export const FeaturesSection = () => {
	return (
		<section
			id="features"
			className="flex flex-col items-center py-20 bg-neutral-weak"
		>
			<Container wide>
				<h2 className="display-2 text-center mb-12">Zašto Referada.hr?</h2>
				<div className="grid gap-2 md:grid-cols-3">
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
			</Container>
		</section>
	);
};
