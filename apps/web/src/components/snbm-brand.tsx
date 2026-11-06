/** Shared logo lockup: identical typography in header, footer, and splash. */
export function SnbmBrand({ variant = 'default' }: { variant?: 'default' | 'intro' }) {
  return <span className={`snbm-brand-lockup ${variant === 'intro' ? 'snbm-brand-intro' : ''}`}>
    <img src="/assets/snbm/s-mark.svg?v=20261106" alt="" className="snbm-brand-icon" width="56" height="56" />
    <span className="snbm-brand-words">
      <strong>SNBM</strong>
      <span className="snbm-brand-creator">CREATOR<sup>®</sup></span>
    </span>
  </span>;
}
