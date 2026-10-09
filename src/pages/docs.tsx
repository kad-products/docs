import type { InferPageType } from 'fumadocs-core/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type React from 'react';
import { requestInfo } from 'rwsdk/worker';
import { source } from '@/lib/source';

type Page = InferPageType<typeof source>;

export default async function Pages__docs({ slug: rawSlug }: { slug: string }): Promise<React.JSX.Element> {
	const slug = rawSlug.replace(/\/+$/, '');
	const slugs = slug === 'index' ? [] : slug.split('/');
	const page: Page | undefined = source.getPage(slugs);

	if (!page) {
		requestInfo.response.status = 404;
		return (
			<DocsPage>
				<DocsBody>
					<h1>Not Found</h1>
					<p>
						No documentation found for <code>{slug}</code>.
					</p>
				</DocsBody>
			</DocsPage>
		);
	}

	const MDX = page.data.body;

	return (
		<DocsPage toc={page.data.toc}>
			<title>{`${page.data.title} | KAD Products Docs`}</title>
			{page.data.description && <meta name="description" content={page.data.description} />}
			<DocsTitle>{page.data.title}</DocsTitle>
			{page.data.description && <DocsDescription>{page.data.description}</DocsDescription>}
			<DocsBody>
				<MDX components={{ ...defaultMdxComponents }} />
			</DocsBody>
		</DocsPage>
	);
}
