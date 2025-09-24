import { JSONContent } from '@tiptap/react';

export const extractText = (jsonContent: JSONContent) => {
	// Convert the JSONContent object to a string
	const jsonString = JSON.stringify(jsonContent);

	// Use regex to find all "text":"value" patterns
	const textRegex = /"text"\s*:\s*"([^"]*)"/g;

	const textValues: string[] = [];
	let match;

	// Extract all matches
	while ((match = textRegex.exec(jsonString)) !== null) {
		textValues.push(match[1] ?? ''); // match[1] is the captured group (the text value)
	}

	// Join all text values with newlines
	return textValues.join('\n');
};

// Example usage:
const example: JSONContent = {
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			content: [{ text: 'asd', type: 'text' }]
		},
		{
			type: 'paragraph',
			content: [{ text: 'asd', type: 'text' }]
		}
	]
};
