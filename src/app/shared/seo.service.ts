import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  setPageMetadata(params: {
    title: string;
    description: string;
    keywords?: string;
    slug?: string;
    ogType?: string;
    ogImage?: string;
    ogVideo?: string;
  }) {
    const brandName = 'RMS Gift Hampers';
    const fullTitle = params.title.includes(brandName) || params.title.includes('RMS')
      ? params.title
      : `${params.title} | ${brandName}`;

    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: params.description });
    this.meta.updateTag({
      name: 'keywords',
      content: params.keywords ?? 'gift hampers, custom gift hampers, return gifts, hamper ideas, festive gifts'
    });
    this.meta.updateTag({ name: 'robots', content: 'index,follow' });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: params.description });
    this.meta.updateTag({ property: 'og:type', content: params.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: brandName });

    // Social Media OpenGraph & Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: params.description });

    if (params.ogImage) {
      this.meta.updateTag({ property: 'og:image', content: params.ogImage });
      this.meta.updateTag({ name: 'twitter:image', content: params.ogImage });
    }

    if (params.ogVideo) {
      this.meta.updateTag({ property: 'og:video', content: params.ogVideo });
    }

    if (typeof this.document?.location !== 'undefined') {
      const canonicalUrl = `${this.document.location.origin}${params.slug ? `/${params.slug}` : this.document.location.pathname}`;
      let canonicalLink = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

      if (!canonicalLink) {
        canonicalLink = this.document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        this.document.head.appendChild(canonicalLink);
      }

      canonicalLink.setAttribute('href', canonicalUrl);
    }
  }

  setJsonLd(schema: object | object[], scriptId = 'seo-json-ld') {
    if (typeof this.document !== 'undefined') {
      let script = this.document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = this.document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        this.document.head.appendChild(script);
      }
      script.text = JSON.stringify(schema, null, 2);
    }
  }

  removeJsonLd(scriptId = 'seo-json-ld') {
    if (typeof this.document !== 'undefined') {
      const script = this.document.getElementById(scriptId);
      if (script?.parentNode) {
        script.parentNode.removeChild(script);
      }
    }
  }
}
