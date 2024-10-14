import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const collegeRouter = createTRPCRouter({
	hello: publicProcedure.query(async () => {
		const colleges = [
			{
				imgSrc: 'https://picsum.photos/48/48',
				name: 'Agronomski Fakultet',
				slug: 'agr'
			},
			{
				imgSrc: 'https://picsum.photos/48/48',
				name: 'Arhitektonski Fakultet',
				slug: 'arh'
			},
			{
				imgSrc: 'https://picsum.photos/48/48',
				name: 'Edukacijsko-rehabilitacijski fakultet',
				slug: 'erf'
			},
			{
				imgSrc: 'https://picsum.photos/48/48',
				name: 'Ekonomski Fakultet',
				slug: 'eko'
			},
			{
				imgSrc: 'https://picsum.photos/48/48',
				name: 'Fakultet elektrotehnike i računarstva',
				slug: 'fer'
			},
			{
				imgSrc: 'https://picsum.photos/48/48',
				name: 'Fakultet filozofije i religijskih znanosti',
				slug: 'frz'
			}
		];
		return colleges;
	})
});
