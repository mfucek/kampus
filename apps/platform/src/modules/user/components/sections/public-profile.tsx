'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/deps/trpc/react';
import { Button } from '@/lib/shadcn/ui/button';
import { Input } from '@/lib/shadcn/ui/input';
import { useProfileImageUpload } from '../../hooks/use-profile-image-upload';
import { SettingsSubSection } from '../settings-subsection';

export const PublicProfileSection = () => {
	const { data: user } = api.user.get.useQuery();

	const { uploading, openFilePicker } = useProfileImageUpload();

	const { data: profilePictureUrl, isPending: profilePictureUrlPending } =
		api.user.profilePicture.sessionUser.getUrl.useQuery();

	const { mutateAsync: updateName, isPending: updateNamePending } =
		api.user.name.update.useMutation();

	const { mutateAsync: updateBadge, isPending: updateBadgePending } =
		api.user.badge.update.useMutation();

	const [name, setName] = useState(user?.name ?? '');
	const [badge, setBadge] = useState(user?.badge ?? '');

	useEffect(() => {
		setName(user?.name ?? '');
		setBadge(user?.badge ?? '');
	}, [user]);

	const handleUpdateName = async () => {
		try {
			await updateName({ name });

			toast.success('Ime ažurirano', {
				description: `Od sada ste poznati kao ${name} 🥳`
			});
		} catch (error) {
			toast.error('Pogreška', {
				description: 'Pogreška pri ažuriranju imena'
			});
			console.error(error);
		}
	};

	const handleUpdateBadge = async () => {
		try {
			await updateBadge({ badge: badge || null });

			toast.success('Badge ažuriran', {
				description: `Službeno imaš titulu ${badge} 😎`
			});
		} catch (error) {
			toast.error('Pogreška pri ažuriranju badge-a', {
				description: 'Pogreška pri ažuriranju badge-a'
			});
			console.error(error);
		}
	};

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
					<Input value={name} onChange={(e) => setName(e.target.value)} />
					<Button
						variant="solid-weak"
						onClick={handleUpdateName}
						loading={updateNamePending}
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
						disabled={true}
					/>
					<Button
						variant="solid-weak"
						onClick={handleUpdateBadge}
						loading={updateBadgePending}
						disabled={true}
					>
						Save
					</Button>
				</div>
			</SettingsSubSection>
		</>
	);
};
