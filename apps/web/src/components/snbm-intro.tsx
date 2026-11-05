import { useEffect, useState } from 'react';
export function SnbmIntro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { if (sessionStorage.getItem('snbm_intro_seen')) return; } catch { /* no storage */ }
    setShow(true);
    const timer = window.setTimeout(() => {
      setShow(false);
      try { sessionStorage.setItem('snbm_intro_seen', '1'); } catch { /* no storage */ }
    }, 1900);
    return () => window.clearTimeout(timer);
  }, []);
  if (!show) return null;
  return <div className="snbm-intro" aria-label="SNBM Creator" aria-hidden="true"><div className="snbm-intro-inner"><span className="snbm-intro-word">SNBM</span><span className="snbm-intro-sub">CREATOR<sup>®</sup></span></div></div>;
}