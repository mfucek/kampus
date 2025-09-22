import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			'@next/next': nextPlugin
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: true
			}
		},
		rules: {
			'@typescript-eslint/array-type': 'off',
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/consistent-indexed-object-style': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'import/no-anonymous-default-export': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-misused-promises': 'off',
			'prefer-const': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports'
				}
			],
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/require-await': 'off',
			// '@typescript-eslint/no-misused-promises': [
			// 	'error',
			// 	{
			// 		checksVoidReturn: {
			// 			attributes: false
			// 		}
			// 	}
			// ],
			'@next/next/no-img-element': 'off',
			'react-hooks/exhaustive-deps': 'off'
		}
	}
);
