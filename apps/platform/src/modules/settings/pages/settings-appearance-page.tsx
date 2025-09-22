import { Container } from '@/global/components/container';
import { PageHeader } from '@/global/components/page-header';
import { ThemeToggler } from '@/lib/theme/components/theme-toggler';
import { SettingsSubSection } from '@/modules/user/components/settings-subsection';

export const SettingsAppearancePage = () => {
	return (
		<Container className="flex flex-col gap-10 pt-10 pb-20">
			<PageHeader
				title="Appearance"
				breadcrumbs={[
					{ title: 'Settings', link: '/settings' },
					{ title: 'Appearance', link: '/settings/appearance' }
				]}
			/>

			<SettingsSubSection title="Theme">
				<ThemeToggler />
			</SettingsSubSection>
		</Container>
	);
};
