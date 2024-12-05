import * as p from '@clack/prompts';

import { db } from '@/lib/prisma/db';

export const checkCollege = async (collegeSlug: string) => {
	const college = await db.college.findFirst({ where: { slug: collegeSlug } });

	if (!college) {
		throw new Error('College not found.');
	}

	p.log.success(`College found: ${college.id}`);

	return college.id;
};
