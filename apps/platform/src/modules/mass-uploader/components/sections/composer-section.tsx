import { Section } from '@/global/components/section';
import { ContentPadding } from '@/global/layouts/content-padding';
import { ComposerEditor } from '@/modules/composer/components/composer-editor';
import { ComposerWrapper } from '@/modules/composer/components/composer-wrapper';

export const composerSectionDefaultBody = {
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [
				{ type: 'text', text: 'Materijali sa starijih godina su u threadu.' }
			]
		}
	]
};

export const ComposerSection = () => {
	return (
		<ContentPadding>
			<Section
				title="3. Napiši neki opis"
				description="Ovo je neobavezno, ali može biti korisno."
			>
				<ComposerWrapper>
					<ComposerEditor />
				</ComposerWrapper>
			</Section>
		</ContentPadding>
	);
};
