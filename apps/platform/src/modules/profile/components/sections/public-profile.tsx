'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { Input } from '@/lib/shadcn/ui/input';
import { api } from '@/lib/trpc/react';
import Image from 'next/image';
import { SettingsSubSection } from '../settings-subsection';

export const PublicProfileSection = () => {
	const { data: user } = api.account.getUser.useQuery();
	const { data: account } = api.account.getAccount.useQuery();

	return (
		<>
			<SettingsSubSection
				title="Profile Picture"
				description="Upload a profile picture to your account."
			>
				<div className="flex flex-row gap-6 items-center">
					<div className="h-20 w-20 rounded-full border border-neutral-weak bg-neutral-weak relative overflow-hidden">
						{user?.imageUrl && (
							<Image
								src={user.imageUrl}
								alt={'Profile Picture'}
								fill
								className="object-cover"
							/>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<div>
							<Button variant="outline">Upload image</Button>
						</div>
						<p className="body-2 text-neutral-strong">
							Max file size: 10MB, JPG, PNG
						</p>
					</div>
				</div>
			</SettingsSubSection>
			<SettingsSubSection
				title="Display Name"
				description="Set your display name."
			>
				<div className="flex flex-row gap-2">
					<Input defaultValue={user?.displayName} />
					<Button variant="outline">Save</Button>
				</div>
			</SettingsSubSection>
		</>
	);
};
