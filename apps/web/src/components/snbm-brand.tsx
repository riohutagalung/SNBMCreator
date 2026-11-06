import { useRouteLoaderData } from 'react-router';
import type { CSSProperties } from 'react';

/**
 * Shared identity across header, footer and opening animation.
 * Icon and wordmark font can be adjusted via Admin > Konten & tampilan.
 */
export function SnbmBrand({ variant = 'default' }: { variant?: 'default' | 'intro' }) {
  const root = useRouteLoaderData('root') as { siteBrand?: { brand_logo_icon_url?: string; brand_logo_font?: string } } | undefined;
  const brand = root?.siteBrand;
  const font = brand?.brand_logo_font === 'Plus Jakarta Sans' ? "'Plus Jakarta Sans', sans-serif" : "'Space Grotesk', sans-serif";
  const style = { '--snbm-logo-font': font } as CSSProperties;
  return <span style={style} className={`snbm-brand-lockup ${variant === 'intro' ? 'snbm-brand-intro' : ''}`}>
    <img
      src={brand?.brand_logo_icon_url || '/assets/snbm/snbm-icon-hd.png?v=sn-20261106'}
      alt=""
      className="snbm-brand-icon"
      width="56" height="56"
    />
    <span className="snbm-brand-words">
      <strong>SNBM</strong>
      <span className="snbm-brand-creator">CREATOR<sup>®</sup></span>
    </span>
  </span>;
}
