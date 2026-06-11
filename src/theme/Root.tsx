import React, { useEffect, type ReactNode } from 'react';
import { useLocation } from '@docusaurus/router';

function HashScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace('#', '');

    // Try immediately, then retry after delays to handle slow renders
        const tryScroll = (attempts: number) => {
            const el = document.getElementById(id);
            if (el) {
                const navbarHeight = (document.querySelector('.navbar') as HTMLElement)?.offsetHeight || 60;
                const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
                window.scrollTo({ top, behavior: 'smooth' });
                return;
            }
            if (attempts > 0) {
                setTimeout(() => tryScroll(attempts - 1), 100);
            }
        };

    setTimeout(() => tryScroll(10), 100);
  }, [location.hash, location.pathname]);

  return null;
}

export default function Root({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      <HashScrollHandler />
      {children}
    </>
  );
}