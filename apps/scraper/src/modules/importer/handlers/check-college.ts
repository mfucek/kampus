import * as p from '@clack/prompts';

import { db } from '@/lib/prisma/db';

export const checkCollege = async (collegeSlug: string) => {
	const college = await db.college.findFirst({ where: { slug: collegeSlug } });

	if (college) {
		p.log.success(`College found: ${college.id}`);
		return college.id;
	}

	const shouldCreateCollege = await p.confirm({
		message: `College not found: ${collegeSlug}. Would you like to create it?`
	});

	if (!shouldCreateCollege) {
		throw new Error('College not found.');
	}

	const name = (await p.text({
		message: 'College name'
	})) as string;

	const slug = (await p.text({
		message: 'College slug'
	})) as string;

	const newCollege = await db.college.create({
		data: {
			name,
			slug
		}
	});

	return newCollege.id;
};
