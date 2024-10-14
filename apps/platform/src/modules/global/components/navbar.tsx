import { Button } from '@/lib/shadcn/ui/button';
import { useTranslation } from '@/utils/translations/use-translation';

export const Navbar = () => {
	const { t } = useTranslation('hr');

	return (
		<div className="bg-section border-b-neutral-weak h-14 border-b flex flex-row justify-between items-center px-2">
			<div className="title-3">Kampus.hr</div>
			<div className="flex flex-row gap-2">
				<Button theme="accent" size="md" variant="solid-weak">
					{t.register}
				</Button>
				<Button theme="accent" size="md" variant="solid">
					{t.login}
				</Button>
			</div>
		</div>
	);
};
