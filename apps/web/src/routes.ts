import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),
 route('layanan', 'routes/layanan.tsx'),
 route('product/:handle', 'routes/product.$handle.tsx'),
 route('kontak', 'routes/kontak.tsx'),
 route('gabung-host', 'routes/gabung-host.tsx'),
 route('login', 'routes/login.tsx'),
 route('admin', 'routes/admin.tsx'),
 route('blog', 'routes/blog.tsx'),
 route('blog/:slug', 'routes/blog.$slug.tsx'),
 route('cart', 'routes/cart.tsx'),
 route('checkout/success', 'routes/checkout.success.tsx'),
 route('checkout/cancelled', 'routes/checkout.cancelled.tsx'),
 route('llms.txt', 'routes/llms.txt.ts'),
	route('sitemap.xml', 'routes/sitemap.xml.ts'),
	route('robots.txt', 'routes/robots.txt.ts'),
	route('api/health', 'routes/api.health.ts'),
	route('api/*', 'routes/api.$.ts'),
] satisfies RouteConfig;
