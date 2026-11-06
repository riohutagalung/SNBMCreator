import { useEffect, useState } from 'react';

/** Brief opening on a new document load; never interrupts client-side navigation. */
export function SnbmIntro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // The former sessionStorage flag prevented the intro appearing on later
    // visits. Let a fresh page load replay it while React navigation does not.
    setShow(true);
    const timer = window.setTimeout(() => setShow(false), 2400);
    return () => window.clearTimeout(timer);
  }, []);
  if (!show) return null;
  return <div className="snbm-intro" role="status" aria-label="SNBM Creator">
    <div className="snbm-intro-inner">
      <img className="snbm-intro-mark" src="/assets/snbm/s-mark.svg" alt="" width="88" height="88"/>
      <span className="snbm-intro-loading">Loading</span>
    </div>
  </div>;
}