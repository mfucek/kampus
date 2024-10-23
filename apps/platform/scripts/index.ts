import { db } from '../src/server/db';

import subjects from './subjects.json';

const getColleges = async () => {
	const colleges = await db.college.findMany();
	console.log(colleges);
};

// await getColleges();

const insertColleges = async () => {
	// await db.college.createMany({
	// 	data: colleges
	// });
};

// await insertColleges();

const slugify = (str: string) => {
	// B. Milašinović Jurkin -> b-milasinovic-jurkin
	const lowerCase = str.toLowerCase();
	const noDots = lowerCase.replace(/\./g, '');
	const noSpaces = noDots.replace(/\s+/g, '-');
	const replacedAccentsWithChars = noSpaces.replace(/[čćšđž]/g, (char) => {
		switch (char) {
			case 'č':
				return 'c';
			case 'ć':
				return 'c';
			case 'š':
				return 's';
			case 'đ':
				return 'd';
			case 'ž':
				return 'z';
			default:
				return '';
		}
	});
	return replacedAccentsWithChars;
};

const flattenList = (l: (any | any[])[]) => {
	return l.flatMap((item) => (Array.isArray(item) ? item : [item]));
};

const createStaffIfNotExists = async (name: string) => {
	const topic = await db.topic.findFirst({
		where: {
			slug: slugify(name)
		}
	});

	if (topic) {
		return topic;
	}

	const newTopic = await db.topic.create({
		data: {
			name: name,
			slug: slugify(name),
			type: 'STAFF',
			collegeId: 'cm2l1cy55000475clharn9mma',
			staff: {
				create: {}
			}
		}
	});

	return newTopic;
};

const createSubjectIfNotExists = async (subject: {
	ects: number;
	satnica: string;
	ime: string;
	sifra: string;
	profesori: string;
}) => {
	const topic = await db.topic.findFirst({
		where: {
			slug: slugify(subject.ime)
		}
	});

	if (topic) {
		return topic;
	}

	const newTopic = await db.topic.create({
		data: {
			name: subject.ime,
			slug: slugify(subject.ime),
			type: 'SUBJECT',
			collegeId: 'cm2l1cy55000475clharn9mma',
			subject: {
				create: {
					ects: subject.ects
				}
			}
		}
	});

	return newTopic;
};

const insertSubjects = async () => {
	const s = subjects as {
		ects: number;
		satnica: string;
		ime: string;
		sifra: string;
		profesori: string;
	}[];

	const uniqueSubjectIds = new Set(s.map((sj) => sj.sifra));
	const uniqueSubjects = Array.from(uniqueSubjectIds).map((id) =>
		s.find((sj) => sj.sifra === id)
	);

	for (const subject of uniqueSubjects) {
		if (!subject) continue;
		console.log(subject?.ime);
		console.log(subject?.profesori);
		console.log();

		const newTopic = await createSubjectIfNotExists(subject);

		if (!newTopic) continue;

		const professorIds = (
			await Promise.all(
				subject.profesori.split(', ').map((p) => createStaffIfNotExists(p))
			)
		).map((t) => t.id);

		await db.subject.update({
			where: {
				topicId: newTopic.id
			},
			data: {
				Staff: {
					connect: professorIds.map((id) => ({ topicId: id }))
				}
			}
		});
	}
};

// const uniqueProfs = new Set(
// 	flattenList(s.map((sj) => sj.profesori.split(', ')))
// );

// for (const prof of uniqueProfs) {
// 	console.log(prof, slugify(prof));

// 	await createStaffIfNotExists(prof);
// }
await insertSubjects();

// await createStaffIfNotExists('B. Milašinović');
