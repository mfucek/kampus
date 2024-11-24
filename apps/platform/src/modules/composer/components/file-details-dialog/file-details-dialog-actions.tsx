import { DialogClose } from '@/lib/shadcn/ui/dialog';

import { Icon } from '@/global/components/icon';
import { Button } from '@/lib/shadcn/ui/button';
import { useComposerUploadDialog } from '../../hooks/use-composer-upload-dialog';

export const FileDetailsDialogActions = () => {
	const { openFileDialog } = useComposerUploadDialog();

	return (
		<div className="border-t border-neutral-weak px-3 gap-2 py-10 md:py-3 grow-0 shrink-0 flex flex-col md:flex-row">
			<Button variant="solid-weak" onClick={openFileDialog}>
				Dodaj file
				<Icon icon="upload" size={16} />
			</Button>
			<div className="flex flex-col md:flex-row gap-2 flex-1 justify-end">
				{/* <DialogClose asChild>
				<Button variant="solid-weak">Odustani</Button>
			</DialogClose> */}
				<DialogClose asChild>
					<Button theme="accent">Spremi</Button>
				</DialogClose>
			</div>
		</div>
	);
};
