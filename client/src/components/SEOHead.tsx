import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  hreflang?: { lang: string; href: string }[];
}

export function SEOHead({
  title,
  description,
  canonical,
  keywords,
  ogTitle,
  ogDescription,
  ogType = "website",
  twitterTitle,
  twitterDescription,
  hreflang,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMeta("description", description);
    if (keywords?.length) {
      updateMeta("keywords", keywords.join(", "));
    }

    updateMeta("og:title", ogTitle || title, true);
    updateMeta("og:description", ogDescription || description, true);
    updateMeta("og:type", ogType, true);
    if (canonical) {
      updateMeta("og:url", canonical, true);
    }

    updateMeta("twitter:title", twitterTitle || title, false);
    updateMeta("twitter:description", twitterDescription || description, false);

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonical;
    }

    const existingHreflang = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflang.forEach((el) => el.remove());

    if (hreflang?.length) {
      hreflang.forEach(({ lang, href }) => {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = lang;
        link.href = href;
        document.head.appendChild(link);
      });
    }

    return () => {
    };
  }, [title, description, canonical, keywords, ogTitle, ogDescription, ogType, twitterTitle, twitterDescription, hreflang]);

  return null;
}
