import { db } from '@/deps/prisma';
import { type Metadata } from 'next';

const defaultDescription =
	'Kampus.hr je mjesto za diskusije, dijeljenje materijala i povezivanje s kolegama.';
const defaultTitle = 'Kampus.hr';
const siteName = 'Kampus.hr';
const titleSuffix = ' | Kampus.hr';
const defaultCoverImage = 'https://kampus.hr/cover.png';

export const generateSubjectMetadata = async ({
	params
}: {
	params: Promise<{
		subjectSlug: string;
		collegeSlug: string;
	}>;
}): Promise<Metadata> => {
	const { subjectSlug, collegeSlug } = await params;

	const subject = await db.topic.findFirst({
		where: {
			slug: subjectSlug,
			type: 'SUBJECT',
			College: {
				slug: collegeSlug
			}
		}
	});

	if (!subject) {
		return {
			title: defaultTitle,
			description: 'Predmet nije pronađen!'
		};
	}

	return {
		title: subject.name + titleSuffix,
		description: defaultDescription,
		twitter: {
			card: 'summary_large_image',
			title: subject.name,
			images: [defaultCoverImage]
		},
		openGraph: {
			title: subject.name + titleSuffix,
			description: defaultDescription,
			url: `https://kampus.hr/${collegeSlug}/subject/${subjectSlug}`,
			type: 'website',
			siteName: siteName,
			images: [defaultCoverImage],
			locale: 'hr-HR'
		}
	};
};

export const generateCollegeMetadata = async ({
	params
}: {
	params: Promise<{
		collegeSlug: string;
	}>;
}): Promise<Metadata> => {
	const { collegeSlug } = await params;

	const college = await db.college.findFirst({
		where: {
			slug: collegeSlug
		}
	});

	if (!college) {
		return {
			title: defaultTitle,
			description: 'Fakultet nije pronađen!'
		};
	}

	return {
		title: college.name + titleSuffix,
		description: defaultDescription,
		twitter: {
			card: 'summary_large_image',
			title: college.name,
			images: [defaultCoverImage]
		},
		openGraph: {
			title: college.name + titleSuffix,
			description: defaultDescription,
			url: `https://kampus.hr/${college.slug}`,
			type: 'website',
			siteName: siteName,
			images: [defaultCoverImage],
			locale: 'hr-HR'
		}
	};
};

export const generateStaffMetadata = async ({
	params
}: {
	params: Promise<{
		staffSlug: string;
		collegeSlug: string;
	}>;
}): Promise<Metadata> => {
	const { staffSlug, collegeSlug } = await params;

	const staff = await db.topic.findFirst({
		where: {
			slug: staffSlug,
			type: 'STAFF',
			College: {
				slug: collegeSlug
			}
		}
	});

	if (!staff) {
		return {
			title: defaultTitle,
			description: 'Osoba nije pronađena!'
		};
	}

	return {
		title: staff.name + titleSuffix,
		description: defaultDescription,
		twitter: {
			card: 'summary_large_image',
			title: staff.name,
			images: [defaultCoverImage]
		},
		openGraph: {
			title: staff.name + titleSuffix,
			description: defaultDescription,
			url: `https://kampus.hr/${collegeSlug}/staff/${staffSlug}`,
			type: 'website',
			siteName: siteName,
			images: [defaultCoverImage],
			locale: 'hr-HR'
		}
	};
};

export const generateProgramMetadata = async ({
	params
}: {
	params: Promise<{
		programSlug: string;
		collegeSlug: string;
	}>;
}): Promise<Metadata> => {
	const { programSlug, collegeSlug } = await params;

	const program = await db.topic.findFirst({
		where: {
			slug: programSlug,
			type: 'PROGRAM',
			College: {
				slug: collegeSlug
			}
		}
	});

	if (!program) {
		return {
			title: defaultTitle,
			description: 'Smjer nije pronađen!'
		};
	}

	return {
		title: program.name + titleSuffix,
		description: defaultDescription,
		twitter: {
			card: 'summary_large_image',
			title: program.name,
			images: [defaultCoverImage]
		},
		openGraph: {
			title: program.name + titleSuffix,
			description: defaultDescription,
			url: `https://kampus.hr/${collegeSlug}/program/${programSlug}`,
			type: 'website',
			siteName: siteName,
			images: [defaultCoverImage],
			locale: 'hr-HR'
		}
	};
};

export const generateGeneralTopicMetadata = async ({
	params
}: {
	params: Promise<{
		generalTopicSlug: string;
	}>;
}): Promise<Metadata> => {
	const { generalTopicSlug } = await params;

	const generalTopic = await db.topic.findFirst({
		where: {
			slug: generalTopicSlug,
			type: 'GENERAL'
		}
	});

	if (!generalTopic) {
		return {
			title: defaultTitle,
			description: 'Generalni topic nije pronađen!'
		};
	}

	return {
		title: generalTopic.name + titleSuffix,
		description: defaultDescription,
		twitter: {
			card: 'summary_large_image',
			title: generalTopic.name,
			images: [defaultCoverImage]
		},
		openGraph: {
			title: generalTopic.name + titleSuffix,
			description: defaultDescription,
			url: `https://kampus.hr/general/${generalTopicSlug}`,
			type: 'website',
			siteName: siteName,
			images: [defaultCoverImage],
			locale: 'hr-HR'
		}
	};
};
