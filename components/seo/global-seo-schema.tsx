'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  absoluteUrl,
  breadcrumbSchema,
  organizationSchema,
  travelAgencySchema,
  websiteSchema,
} from '@/lib/seo';

function toLabel(segment: string) {
  return decodeURIComponent(segment)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function GlobalSeoSchema() {
  const pathname = usePathname();

  const schema = useMemo(() => {
    const path = pathname || '/';
    const parts = path.split('/').filter(Boolean);
    const breadcrumbItems = [
      { label: 'Home', href: '/' },
      ...parts.map((segment, index) => ({
        label: toLabel(segment),
        href: `/${parts.slice(0, index + 1).join('/')}`,
      })),
    ];

    return [
      organizationSchema(),
      websiteSchema(),
      travelAgencySchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: parts.length ? toLabel(parts[parts.length - 1]) : 'Egypt Tours Gate',
        url: absoluteUrl(path),
      },
      breadcrumbSchema(breadcrumbItems),
    ];
  }, [pathname]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
