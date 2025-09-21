import { db } from '@/deps/prisma';
import { r2Client } from '@/deps/s3/client';
import { deleteFiles } from '@/deps/s3/delete-files';
import { ListObjectsCommand } from '@aws-sdk/client-s3';

// remove all s3 files in bucket

const command = new ListObjectsCommand({
	Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME
});

const response = await r2Client.send(command);

const keys =
	(response.Contents?.filter((content) => !!content.Key).map(
		(content) => content.Key
	) as string[]) ?? [];

await deleteFiles(keys);

// remove all non-user data

await db.post.deleteMany();
await db.vote.deleteMany();

await db.documentFile.deleteMany();
await db.imageFile.deleteMany();
await db.file.deleteMany();

await db.college.deleteMany();
await db.program.deleteMany();
await db.subject.deleteMany();
await db.staff.deleteMany();
await db.generalTopic.deleteMany();
await db.summary.deleteMany();
await db.topic.deleteMany();

await db.notification.deleteMany();

// create college

const college = await db.topic.create({
	data: {
		name: 'Testni Fakultet',
		slug: 'testni-fakultet',
		type: 'COLLEGE',
		College: {
			create: {
				externalLinks: ['https://www.testni-fakultet.hr']
			}
		}
	}
});

// create staff

const staff_1 = await db.topic.create({
	data: {
		name: 'Profesor 1',
		slug: 'profesor-1',
		type: 'STAFF',
		Staff: {
			create: {
				staffExternalCode: '00001',
				staffExternalLink: 'https://www.testni-fakultet.hr/professor/1',
				collegeId: college.id
			}
		}
	}
});

const staff_2 = await db.topic.create({
	data: {
		name: 'Profesor 2',
		slug: 'profesor-2',
		type: 'STAFF',
		Staff: {
			create: {
				staffExternalCode: '00002',
				staffExternalLink: 'https://www.testni-fakultet.hr/professor/2',
				collegeId: college.id
			}
		}
	}
});

// create subject

const subject_1 = await db.topic.create({
	data: {
		name: 'Predmet 1',
		slug: 'predmet-1',
		type: 'SUBJECT',
		Subject: {
			create: {
				collegeId: college.id,
				ects: 6,
				externalCodes: ['S00001'],
				externalLinks: ['https://www.testni-fakultet.hr/subject/1'],
				Staffs: {
					createMany: {
						data: [
							{
								staffId: staff_1.id,
								staffRole: 'profesor'
							},
							{
								staffId: staff_2.id,
								staffRole: 'asistent'
							}
						]
					}
				}
			}
		}
	}
});

const subject_2 = await db.topic.create({
	data: {
		name: 'Predmet 2',
		slug: 'predmet-2',
		type: 'SUBJECT',
		Subject: {
			create: {
				collegeId: college.id,
				ects: 6,
				externalCodes: ['S00002'],
				externalLinks: ['https://www.testni-fakultet.hr/subject/2'],
				Staffs: {
					createMany: {
						data: [
							{
								staffId: staff_1.id,
								staffRole: 'profesor'
							},
							{
								staffId: staff_2.id,
								staffRole: 'asistent'
							}
						]
					}
				}
			}
		}
	}
});

const subject_3 = await db.topic.create({
	data: {
		name: 'Predmet 3',
		slug: 'predmet-3',
		type: 'SUBJECT',
		Subject: {
			create: {
				collegeId: college.id,
				ects: 6,
				externalCodes: ['S00003'],
				externalLinks: ['https://www.testni-fakultet.hr/subject/3'],
				Staffs: {
					createMany: {
						data: [
							{
								staffId: staff_1.id,
								staffRole: 'profesor'
							},
							{
								staffId: staff_2.id,
								staffRole: 'asistent'
							}
						]
					}
				}
			}
		}
	}
});

// create program

const program_1 = await db.topic.create({
	data: {
		name: 'Program 1',
		slug: 'program-1',
		type: 'PROGRAM',
		Program: {
			create: {
				collegeId: college.id,
				programExternalCode: 'P00001',
				programExternalLink: 'https://www.testni-fakultet.hr/program/1',
				type: 'preddiplomski',
				departments: ['Department 1'],
				Subjects: {
					createMany: {
						data: [
							{
								subjectId: subject_1.id,
								semester: 1,
								groupName: 'Group'
							},
							{
								subjectId: subject_2.id,
								semester: 2,
								groupName: 'Group'
							}
						]
					}
				}
			}
		}
	}
});

const program_2 = await db.topic.create({
	data: {
		name: 'Program 2',
		slug: 'program-2',
		type: 'PROGRAM',
		Program: {
			create: {
				collegeId: college.id,
				programExternalCode: 'P00002',
				programExternalLink: 'https://www.testni-fakultet.hr/program/1',
				type: 'diplomski',
				departments: ['Department 1'],
				Subjects: {
					createMany: {
						data: [
							{
								subjectId: subject_3.id,
								semester: 1,
								groupName: 'Group'
							}
						]
					}
				}
			}
		}
	}
});

// create general topic

const general_topic_1 = await db.topic.create({
	data: {
		name: 'General Topic 1',
		slug: 'general-topic-1',
		type: 'GENERAL',
		GeneralTopic: {
			create: {
				icon: 'users'
			}
		}
	}
});

const general_topic_2 = await db.topic.create({
	data: {
		name: 'General Topic 2',
		slug: 'general-topic-2',
		type: 'GENERAL',
		GeneralTopic: {
			create: {
				icon: 'book'
			}
		}
	}
});
