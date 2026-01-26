// app/blogs/[slug]/page.tsx
import React from "react";

type Props = { params: { slug: string } };

export default function Page({ params }: Props) {
  return <div>Blog: {params.slug}</div>;
}
