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
}
