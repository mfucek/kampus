import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { ThemeToggler } from '@/modules/theme/components/theme-toggler';
import { SettingsSubSection } from '@/modules/user/components/settings-subsection';

export const SettingsAppearancePage = () => {
	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader title="Appearance" />

			<SettingsSubSection title="Theme">
				<ThemeToggler />
			</SettingsSubSection>
		</Container>
	);
};
