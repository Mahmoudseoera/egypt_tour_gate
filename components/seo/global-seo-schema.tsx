'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

const SITE_URL = 'https://www.egypttoursgate.com';

function toLabel(segment: string) {
  return decodeURIComponent(segment).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function GlobalSeoSchema() {
  const pathname = usePathname();

  const schema = useMemo(() => {
    const path = pathname || '/';
    const parts = path.split('/').filter(Boolean);

    const itemListElement = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      ...parts.map((segment, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: toLabel(segment),
        item: `${SITE_URL}/${parts.slice(0, index + 1).join('/')}`,
      })),
    ];

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Egypt Tours Gate',
        url: `${SITE_URL}${path}`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement,
      },
    ];
  }, [pathname]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
