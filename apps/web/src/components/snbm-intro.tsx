import { useEffect, useState } from 'react';

/**
 * Full-screen "SNBM" bumper shown once per browser session when the site opens,
 * then fades away. Skippable on click. sessionStorage keeps it from replaying
 * on every in-app navigation.
 */
export function SnbmIntro() {
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (sessionStorage.getItem('snbm_intro_seen')) return;
		setShow(true);
		const timer = window.setTimeout(() => {
			setShow(false);
			sessionStorage.setItem('snbm_intro_seen', '1');
		}, 2600);
		return () => window.clearTimeout(timer);
	}, []);

	const dismiss = () => {
		setShow(false);
		if (typeof window !== 'undefined') sessionStorage.setItem('snbm_intro_seen', '1');
	};

	if (!show) return null;

	return (
		<div className="snbm-intro" role="dialog" aria-label="Pembuka SNBM Creator" onClick={dismiss}>
			<div className="snbm-intro-inner">
				<span className="snbm-intro-word">SNBM</span>
				<span className="snbm-intro-sub">CREATOR®</span>
				<span className="snbm-intro-hint">klik untuk lewati</span>
			</div>
		</div>
	);
}
