import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/base';
import type React from 'react';
import type { LayoutProps } from 'rwsdk/router';
import { RWSDKProvider } from '@/lib/fumadocs-provider';
import { source } from '@/lib/source';

export default function DocsStandardLayout({ children, requestInfo }: LayoutProps): React.JSX.Element {
	const pathname = requestInfo ? new URL(requestInfo.request.url).pathname : '/';

	return (
		<RWSDKProvider pathname={pathname}>
			<RootProvider search={{ enabled: false }}>
				<DocsLayout
					tree={source.pageTree}
					nav={{
						title: 'KAD Products Docs',
						url: '/',
					}}
				>
					{children}
				</DocsLayout>
			</RootProvider>
		</RWSDKProvider>
	);
}
