import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/lib/shadcn/ui/table';

const invoices = [
	{
		file: 'Meduispit 2024/2025',
		author: 'Joca',
		tags: 'Meduispit, Kolokvij, Rijesen',
		actions: 'Preuzmi'
	},
	{
		file: 'Zavrsni ispit 2024/2025',
		author: 'Franko',
		tags: 'Zavrsni ispit, Rijesen',
		actions: 'Preuzmi'
	},
	{
		file: 'JIR 2023/2024',
		author: 'Marko',
		tags: 'Rok, Rijesen',
		actions: 'Preuzmi'
	},
	{
		file: 'Zavrsni ispit 2023/2024',
		author: 'Marko',
		tags: 'Zavrsni ispit, Rijesen',
		actions: 'Preuzmi'
	}
];

export const MaterialsTable = () => {
	return (
		<Table>
			{/* <TableCaption>A list of your recent invoices.</TableCaption> */}
			<TableHeader>
				<TableRow>
					<TableHead>Datoteka</TableHead>
					<TableHead className="w-[100px]">Autor</TableHead>
					<TableHead>Oznake</TableHead>
					<TableHead className="text-right"></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{invoices.map((invoice) => (
					<TableRow key={invoice.file}>
						<TableCell>{invoice.file}</TableCell>
						<TableCell>{invoice.author}</TableCell>
						<TableCell>{invoice.tags}</TableCell>
						<TableCell className="text-right">{invoice.actions}</TableCell>
					</TableRow>
				))}
			</TableBody>
			{/* <TableFooter>
				<TableRow>
					<TableCell colSpan={3}>Total</TableCell>
					<TableCell className="text-right">$2,500.00</TableCell>
				</TableRow>
			</TableFooter> */}
		</Table>
	);
};
