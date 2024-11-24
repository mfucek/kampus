'use client';

import { Button } from '@/lib/shadcn/ui/button';
import { Input } from '@/lib/shadcn/ui/input';
import { useToast } from '@/lib/shadcn/ui/use-toast';
import { api } from '@/lib/trpc/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useProfileImageUpload } from '../../hooks/use-profile-image-upload';
import { SettingsSubSection } from '../settings-subsection';

export const PublicProfileSection = () => {
	const { data: user } = api.account.getUser.useQuery();
	const { data: account } = api.account.getAccount.useQuery();

	const { uploading, openFilePicker } = useProfileImageUpload();

	const { data: profilePictureUrl, isPending: profilePictureUrlPending } =
		api.account.getCurrentUserProfilePictureUrl.useQuery();

	const {
		mutateAsync: updateDisplayName,
		isPending: updateDisplayNamePending
	} = api.account.updateDisplayName.useMutation();

	const { mutateAsync: updateBadge, isPending: updateBadgePending } =
		api.account.updateBadge.useMutation();

	const [displayName, setDisplayName] = useState(user?.displayName ?? '');
	const [badge, setBadge] = useState(user?.badge ?? '');

	const { toast } = useToast();

	useEffect(() => {
		setDisplayName(user?.displayName ?? '');
		setBadge(user?.badge ?? '');
	}, [user]);

	const handleUpdateDisplayName = async () => {
		try {
			await updateDisplayName({ displayName });

			toast({
				title: 'Success',
				description: 'Your display name has been updated successfully',
				variant: 'success'
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An error occurred while updating your display name',
				variant: 'danger'
			});
			console.error(error);
		}
	};

	const handleUpdateBadge = async () => {
		try {
			await updateBadge({ badge: badge || null });
		} catch (error) {
			console.error('Error updating badge:', error);
			toast({
				title: 'Error',
				description: 'An error occurred while updating your badge',
				variant: 'danger'
			});
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
						{profilePictureUrl && (
							<Image
								src={profilePictureUrl}
								alt={'Profile Picture'}
								fill
								className="object-cover"
								quality={80}
							/>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<div>
							<Button
								variant="solid-weak"
								onClick={openFilePicker}
								loading={uploading || profilePictureUrlPending}
							>
								Upload image
							</Button>
						</div>
						<p className="body-2 text-neutral-strong">
							Max file size: 5MB, JPG, PNG
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
					<Button
						variant="solid-weak"
						onClick={handleUpdateDisplayName}
						loading={updateDisplayNamePending}
					>
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
						variant="solid-weak"
						onClick={handleUpdateBadge}
						loading={updateBadgePending}
						disabled={!isLegendPlan}
					>
						Save
					</Button>
				</div>
			</SettingsSubSection>
		</>
	);
};
