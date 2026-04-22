import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.cybernestsolution.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-cybernest-banner.jpg`;

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  breadcrumbs?: BreadcrumbItem[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  breadcrumbs,
  jsonLd,
}: SeoProps) {
  const url = `${SITE_URL}${path}`;

  const schemas: Record<string, unknown>[] = [];
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(buildBreadcrumbSchema(breadcrumbs));
  }
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      schemas.push(...jsonLd);
    } else {
      schemas.push(jsonLd);
    }
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_PH" />
      <meta property="og:site_name" content="Cybernest Solutions" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
