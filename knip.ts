export default {
	tags: ['-lintignore', '-knipTestExport'],
	ignoreExportsUsedInFile: true,
	entry: ['tests/mocks/**'],
	ignoreFiles: [
		'src/client.tsx',
		'release.config.js',
		// MDX content files are discovered by fumadocs via import.meta.glob, not static imports
		'src/content/**',
		// Vite alias targets — referenced by path in vite.config.mts, never imported directly
		'src/lib/module-stub.ts',
		'src/lib/framework-stub.cjs',
	],
	compilers: {
		css: (text: string): string => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
	},
};
