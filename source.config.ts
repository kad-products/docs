import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';

export const docs = defineDocs({
	dir: 'src/content/docs',
	docs: {
		schema: frontmatterSchema.extend({}),
	},
});

export default defineConfig({});
