'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { Input } from '@/lib/shadcn/ui/input';
import { api } from '@/lib/trpc/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SettingsSubSection } from '../settings-subsection';

export const PublicProfileSection = () => {
	const { data: user } = api.account.getUser.useQuery();
	const { data: account } = api.account.getAccount.useQuery();

	const { mutateAsync: updateDisplayName } =
		api.account.updateDisplayName.useMutation();

	const { mutateAsync: updateBadge } = api.account.updateBadge.useMutation();

	const [displayName, setDisplayName] = useState(user?.displayName ?? '');
	const [badge, setBadge] = useState(user?.badge ?? '');

	useEffect(() => {
		setDisplayName(user?.displayName ?? '');
		setBadge(user?.badge ?? '');
	}, [user]);

	const handleUpdateDisplayName = async () => {
		await updateDisplayName({ displayName });
	};

	const handleUpdateBadge = async () => {
		try {
			await updateBadge({ badge: badge || null });
			// Optionally, you can add a success message or refetch the user data here
		} catch (error) {
			console.error('Error updating badge:', error);
			// Optionally, you can show an error message to the user
		}
	};

	const isLegendPlan = ['MONTHLY_PRO', 'LIFETIME'].includes(account?.package!);

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
					<Input
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
					/>
					<Button variant="outline" onClick={handleUpdateDisplayName}>
						Save
					</Button>
				</div>
			</SettingsSubSection>

			<SettingsSubSection
				title={
					<>
						Badge
						<span className="ml-2 caption px-2 rounded-full bg-warning-medium text-warning">
							Legenda
						</span>
					</>
				}
				description="Set your badge."
			>
				<div className="flex flex-row gap-2">
					<Input
						value={badge}
						onChange={(e) => setBadge(e.target.value)}
						disabled={!isLegendPlan}
					/>
					<Button
						variant="outline"
						onClick={handleUpdateBadge}
						disabled={!isLegendPlan}
					>
						Save
					</Button>
				</div>
			</SettingsSubSection>
		</>
	);
};
