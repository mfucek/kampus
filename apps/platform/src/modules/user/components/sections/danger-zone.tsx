import { Button } from '@/lib/shadcn/ui/button';
import { SettingsSubSection } from '../settings-subsection';

export const DangerZoneSection = () => {
	return (
		<SettingsSubSection title="Danger Zone">
			<Button theme="danger" variant="solid-weak" disabled>
				Delete Account
			</Button>
		</SettingsSubSection>
	);
};
