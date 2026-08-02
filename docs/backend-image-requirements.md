# Backend image requirements

These are the recommended source dimensions for images returned by the API. Keep the subject inside the central safe area because responsive cards use `object-fit: cover` and may crop the edges.

| Usage | Recommended source | Aspect ratio | Maximum target size | Notes |
| --- | ---: | ---: | ---: | --- |
| Homepage hero / page cover | 1920 x 1080 px | 16:9 | 350 KB | WebP or AVIF; no text embedded in the image |
| Tour and blog details hero | 1920 x 1080 px | 16:9 | 350 KB | Keep the main subject near the center |
| Tour category / subcategory card | 1200 x 800 px | 3:2 | 220 KB | Every category should have a distinct image |
| Tour card | 900 x 675 px | 4:3 | 180 KB | Avoid logos, watermarks, and duplicate images |
| Blog category card | 1200 x 800 px | 3:2 | 220 KB | Use a distinct representative category image |
| Blog article card | 1200 x 800 px | 3:2 | 220 KB | Use a unique article image |
| Tour gallery image | 1600 x 1200 px | 4:3 | 300 KB | All gallery images should use one consistent ratio |
| About / services image | 1200 x 900 px | 4:3 | 220 KB | Keep important details away from the edges |
| Partner logo | 500 x 300 px | 5:3 canvas | 80 KB | Transparent WebP or PNG |
| Site logo | 500 x 180 px | flexible | 80 KB | Transparent WebP, SVG, or PNG |
| Author / testimonial avatar | 400 x 400 px | 1:1 | 80 KB | Square crop with the face centered |
| Open Graph sharing image | 1200 x 630 px | 1.91:1 | 300 KB | Required for pages that provide a dedicated SEO image |

## Required API fields

Every image object should provide:

- `image`: absolute HTTPS URL.
- `alt`: concise, descriptive text matching the image and page language.
- `title`: human-readable image title.
- `width` and `height`: original pixel dimensions when the backend can provide them.

## Delivery rules

- Prefer AVIF, then WebP; use PNG only for transparency.
- Do not upscale small source images.
- Strip EXIF and other unnecessary metadata.
- Avoid returning the same image for unrelated categories, tours, or articles.
- Keep filenames descriptive and stable; changing the URL invalidates the optimized image cache.
- Return a fallback image only when no owned image exists, and mark that case explicitly in the API payload.
