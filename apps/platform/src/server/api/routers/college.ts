import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

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

export const collegeRouter = createTRPCRouter({
	listAll: publicProcedure.query(async () => {
		return colleges;
	}),

	getBySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
		const college = colleges.find((college) => college.slug === input);

		if (!college) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'College not found'
			});
		}

		return college;
	})
});
