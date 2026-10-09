'use client';

import { FrameworkProvider } from 'fumadocs-core/framework';
import type React from 'react';
import { createContext, type ReactNode, useCallback, useContext, useSyncExternalStore } from 'react';
import { navigate } from 'rwsdk/client';

// Holds the server-rendered pathname so useSyncExternalStore returns the
// correct value during SSR rather than always falling back to "/".
const PathnameContext = createContext('/');

function subscribe(callback: () => void): () => void {
	window.addEventListener('popstate', callback);
	return () => {
		window.removeEventListener('popstate', callback);
	};
}

function getSnapshot(): string {
	return window.location.pathname;
}

export function usePathname(): string {
	const serverPathname = useContext(PathnameContext);
	return useSyncExternalStore(subscribe, getSnapshot, () => serverPathname);
}

function useParams(): { slugs?: string[] } {
	const pathname = usePathname();
	const slugs = pathname.split('/').filter(Boolean);
	return { slugs: slugs.length > 0 ? slugs : undefined };
}

function Link({
	href,
	prefetch,
	children,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { prefetch?: boolean }): React.JSX.Element {
	return (
		<>
			{prefetch && href && <link rel="x-prefetch" href={href} />}
			<a href={href} {...props}>
				{children}
			</a>
		</>
	);
}

function useRouter(): { push: (url: string) => void; refresh: () => void } {
	const push = useCallback((url: string) => {
		navigate(url);
	}, []);

	const refresh = useCallback(() => {
		navigate(window.location.href, { history: 'replace' });
	}, []);

	return { push, refresh };
}

/**
 * Bridges fumadocs' framework-agnostic APIs (usePathname, useRouter, Link) to
 * RWSDK's client-side navigation.
 *
 * Pass the server-rendered pathname from the request so the SSR snapshot
 * reflects the correct active page in the sidebar.
 */
export function RWSDKProvider({ children, pathname = '/' }: { children: ReactNode; pathname?: string }): React.JSX.Element {
	return (
		<PathnameContext.Provider value={pathname}>
			<FrameworkProvider usePathname={usePathname} useParams={useParams} useRouter={useRouter} Link={Link}>
				{children}
			</FrameworkProvider>
		</PathnameContext.Provider>
	);
}
