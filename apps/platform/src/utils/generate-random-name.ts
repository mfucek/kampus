const adjectives = [
	'Quick',
	'Lazy',
	'Brave',
	'Clever',
	'Happy',
	'Sad',
	'Angry',
	'Silly',
	'Witty',
	'Quirky',
	'Zesty',
	'Jumpy',
	'Fuzzy',
	'Giant',
	'Tiny',
	'Swift',
	'Chilly',
	'Sunny',
	'Noisy',
	'Quiet'
];

const nouns = [
	'Panda',
	'Tiger',
	'Lion',
	'Fox',
	'Eagle',
	'Bear',
	'Wolf',
	'Otter',
	'Hawk',
	'Turtle',
	'Rabbit',
	'Lizard',
	'Frog',
	'Snake',
	'Shark',
	'Penguin',
	'Octopus',
	'Monkey',
	'Badger',
	'Koala'
];

export const generateRandomName = () => {
	const randomAdjective =
		adjectives[Math.floor(Math.random() * adjectives.length)];
	const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
	const randomNumber = Math.floor(10 + Math.random() * 90); // Random 2-digit number

	return `${randomAdjective} ${randomNoun} ${randomNumber}`;
};
