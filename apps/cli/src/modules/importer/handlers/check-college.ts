import * as p from '@clack/prompts';

import { db } from '@/deps/prisma/db';

export const checkCollege = async (collegeSlug: string) => {
	const college = await db.college.findFirst({
		where: { Topic: { slug: collegeSlug } }
	});

	if (college) {
		p.log.success(`College found: ${college.topicId}`);
		return college.topicId;
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
			Topic: {
				create: {
					type: 'COLLEGE',
					name,
					slug
				}
			}
		}
	});

	return newCollege.topicId;
};
