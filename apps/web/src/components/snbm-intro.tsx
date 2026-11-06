import { useEffect, useState } from 'react';
import { SnbmBrand } from '@/components/snbm-brand';

/** Brief opening on a fresh document load; never interrupts client-side navigation. */
export function SnbmIntro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    const timer = window.setTimeout(() => setShow(false), 2400);
    return () => window.clearTimeout(timer);
  }, []);
  if (!show) return null;
  return <div className="snbm-intro" role="status" aria-label="SNBM Creator">
    <div className="snbm-intro-inner"><SnbmBrand variant="intro" /></div>
  </div>;
}
