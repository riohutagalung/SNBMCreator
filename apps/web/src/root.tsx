import {
	data,
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteLoaderData,
} from 'react-router';
import type { Route } from './+types/root';
import stylesheet from '@/index.css?url';
import { siteOrigin } from '@/lib/site-origin.server';
import { HorizonsPreviewScripts } from './horizons-preview-scripts';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CookieBanner } from '@/components/cookie-banner';
import { SnbmIntro } from '@/components/snbm-intro';
import { LanguageProvider } from '@/lib/language';
import { WebMcpTools } from '@/components/webmcp-tools';
import { getPublicSiteSettings, safeBrandAssetUrl } from '@/lib/site-settings.server';

export const links: Route.LinksFunction = () => [
	{ rel: 'stylesheet', href: stylesheet },
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap',
	},
];

/**
 * Publishes the site's public origin, which `seo()` reads to build canonical and
 * `og:url` tags, and advertises the sitemap to crawlers that read response
 * headers rather than HTML.
 *
 * A `meta` export can only reach server data through `matches`, and the `headers`
 * export cannot see loader data at all, so both have to travel this way.
 */
export async function loader({ request }: Route.LoaderArgs) {
	const origin = siteOrigin(request);
	const settings = await getPublicSiteSettings([
		'brand_logo_icon_url', 'brand_favicon_url', 'brand_touch_icon_url', 'brand_logo_font',
	]);
	const siteBrand = {
		brand_logo_icon_url: safeBrandAssetUrl(settings.brand_logo_icon_url, '/assets/snbm/snbm-icon-hd.png?v=sn-20261106'),
		brand_favicon_url: safeBrandAssetUrl(settings.brand_favicon_url, '/assets/snbm/favicon-32.png?v=sn-20261106'),
		brand_touch_icon_url: safeBrandAssetUrl(settings.brand_touch_icon_url, '/assets/snbm/favicon-180.png?v=sn-20261106'),
		brand_logo_font: settings.brand_logo_font === 'Plus Jakarta Sans' ? 'Plus Jakarta Sans' : 'Space Grotesk',
	};
	return data(
		{ origin, siteBrand },
		{ headers: { Link: `<${origin}/sitemap.xml>; rel="sitemap"; type="application/xml"`,
			'Cache-Control': 'private, no-store, max-age=0' } },
	);
}

/**
 * A page route that exports `headers` replaces this one, so merge `parentHeaders`
 * there rather than returning only that route's own headers.
 */
export function headers({ loaderHeaders }: Route.HeadersArgs) {
	return loaderHeaders;
}

export function Layout({ children }: { children: React.ReactNode }) {
	const data = useRouteLoaderData('root') as { siteBrand?: { brand_favicon_url?: string; brand_touch_icon_url?: string } } | undefined;
	return (
		// suppressHydrationWarning absorbs attributes injected by browser extensions
		// and theme scripts before hydration; attribute-only, one element deep. Keep both.
		<html lang="id" suppressHydrationWarning>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<link rel="icon" type="image/png" sizes="32x32" href={data?.siteBrand?.brand_favicon_url ?? '/assets/snbm/favicon-32.png?v=sn-20261106'} />
				<link rel="apple-touch-icon" sizes="180x180" href={data?.siteBrand?.brand_touch_icon_url ?? '/assets/snbm/favicon-180.png?v=sn-20261106'} />
				<HorizonsPreviewScripts />
			</head>
			<body suppressHydrationWarning>
				<div id="root">{children}</div>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <LanguageProvider><WebMcpTools /><SnbmIntro /><SiteHeader /><Outlet /><SiteFooter /><CookieBanner /></LanguageProvider>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Ada kendala';
	let details = 'Halaman belum dapat dimuat. Silakan coba kembali.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'Halaman yang Anda cari tidak ditemukan.'
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main>
			<h1>{message}</h1>
			<p>{details}</p>
			{stack ? (
				<pre>
					<code>{stack}</code>
				</pre>
			) : null}
		</main>
	);
}