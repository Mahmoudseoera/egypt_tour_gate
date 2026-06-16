'use client';

import { useMemo, useState } from 'react';

interface ExpandableDescriptionProps {
  text: string;
  maxLength?: number;
  className?: string;
  isHtml?: boolean;
}

export default function ExpandableDescription({
  text,
  maxLength = 180,
  className = '',
  isHtml = false,
}: ExpandableDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;

  const content = useMemo(() => {
    const currentContent =
      expanded || !shouldTruncate
        ? text
        : `${text.slice(0, maxLength).trimEnd()}...`;

    if (!isHtml || typeof window === 'undefined') {
      return currentContent;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(currentContent, 'text/html');

    doc.querySelectorAll('a').forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    return doc.body.innerHTML;
  }, [expanded, maxLength, shouldTruncate, text, isHtml]);

  return (
    <div className={className}>
      {isHtml ? (
        <div
          className="text-gray-600 leading-relaxed expandable-description"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-gray-600 leading-relaxed expandable-description">
          {content}
        </p>
      )}

      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-sm font-semibold text-[var(--main-color)] hover:text-[var(--second-color)] transition-colors"
        >
          {expanded ? 'Show Less ⏶' : 'Show More ⏷'}
        </button>
      )}
    </div>
  );
}