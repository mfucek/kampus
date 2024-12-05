import { Bold } from '@tiptap/extension-bold';
import { Code } from '@tiptap/extension-code';
import { Document } from '@tiptap/extension-document';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';

import { type Extensions } from '@tiptap/react';

export const tiptapExtensions: Extensions = [
	Document,
	Paragraph.configure({
		HTMLAttributes: {
			class: 'element-paragraph'
		}
	}),
	Text,
	Bold,
	Italic,
	Strike,
	Code.configure({
		HTMLAttributes: {
			class: 'element-code'
		}
	}),
	Link.configure({
		openOnClick: false,
		autolink: true,
		defaultProtocol: 'https',
		protocols: ['http', 'https'],
		HTMLAttributes: {
			class: 'element-link'
		}
	})
];
