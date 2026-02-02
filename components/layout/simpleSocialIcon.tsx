// components/SimpleSocialIcon.tsx
'use client';

export type SocialItem = {
  icon: string; 
  url: string;
  title: string;
};

interface SimpleSocialIconProps {
  item: SocialItem;
  className?: string;
}

export default function SimpleSocialIcon({ item, className = '' }: SimpleSocialIconProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block p-2 hover:opacity-80 ${className}`}
      title={item.title}
    >
      <i className={item.icon}></i>
    </a>
  );
}