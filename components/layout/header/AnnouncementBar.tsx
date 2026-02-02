'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AnnouncementBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setHidden(window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out overflow-hidden
        ${hidden ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'}
      `}
    >
      <div className="h-10 bg-red-900 text-white text-sm flex items-center justify-center">
        <Link href="#" className="hover:underline">
          Flash Sale: Save 25% Off Sitewide →
        </Link>
      </div>
    </div>
  );
}
