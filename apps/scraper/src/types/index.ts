export type Subject = {
	externalLink: string;
	name: string;
	shortName: string;
	externalCode: string;
	ects: number;
	professorsLinks: { role: string; link: string }[];
};

export type SubjectReference = {
	externalLink: string;
	semester: number;
	groupName: string;
};

export type Program = {
	externalLink: string;
	name: string;
	shortName: string;
	departments: string[];
	subjects: SubjectReference[];
	type: string; //'preddiplomski' | 'diplomski' | 'doktorski' | 'specijalisticki';
};

export type Professor = {
	externalLink: string;
	name: string;
	imageUrl: string | null;
};

export type DriverOptions = {
	debug?: boolean;
	callbacks?: {
		onSubjectsScraped?: (subjects: Subject[]) => void;
		onProgramsScraped?: (programs: Program[]) => void;
		onProfessorsScraped?: (professors: Professor[]) => void;
		onProgress?: (progress: number, total: number, title?: string) => void;
		onCompleted?: () => void;
	};
};
