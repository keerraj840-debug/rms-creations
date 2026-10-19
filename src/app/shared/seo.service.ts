import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoMetadataParams {
  title: string;
  description: string;
  keywords?: string;
  slug?: string;
  ogType?: string;
  ogImage?: string;
  ogVideo?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  readonly defaultDomain = 'https://rmsgifthampers.com';

  setPageMetadata(params: SeoMetadataParams) {
    const brandName = 'RMS Creations';
    const fullTitle = params.title.includes(brandName) || params.title.includes('RMS')
      ? params.title
      : `${params.title} | ${brandName}`;

    this.titleService.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: params.description });
    this.meta.updateTag({
      name: 'keywords',
      content: params.keywords ?? 'gift hampers, custom hampers, Diwali hampers, wedding return gifts, luxury gift boxes Mumbai, pooja kits'
    });
    this.meta.updateTag({ name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: params.description });
    this.meta.updateTag({ property: 'og:type', content: params.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: brandName });
    this.meta.updateTag({ property: 'og:locale', content: 'en_IN' });

    // Canonical URL
    const canonicalUrl = `${this.defaultDomain}${params.slug ? `/${params.slug}` : (this.document?.location?.pathname || '/')}`;
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });

    // Social Media OpenGraph & Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: params.description });

    const ogImage = params.ogImage || `${this.defaultDomain}/assets/banners/banner.png`;
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    if (params.ogVideo) {
      this.meta.updateTag({ property: 'og:video', content: params.ogVideo });
    }

    if (typeof this.document !== 'undefined') {
      let canonicalLink = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = this.document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        this.document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }
  }

  /**
   * Inject rich Schema.org Product structured data for Google shopping & organic rich snippets
   */
  setProductSchema(product: {
    id: number | string;
    name: string;
    description: string;
    price: number;
    image: string;
    category?: string;
    inStock?: boolean;
  }) {
    const productUrl = `${this.defaultDomain}/product/${product.id}`;
    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': product.name,
      'image': [product.image],
      'description': product.description,
      'sku': `RMS-PROD-${product.id}`,
      'mpn': `RMS-${product.id}`,
      'category': product.category || 'Gift Hamper',
      'brand': {
        '@type': 'Brand',
        'name': 'RMS Creations'
      },
      'offers': {
        '@type': 'Offer',
        'url': productUrl,
        'priceCurrency': 'INR',
        'price': product.price,
        'priceValidUntil': '2027-12-31',
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'seller': {
          '@type': 'Organization',
          'name': 'RMS Creations',
          'url': this.defaultDomain
        },
        'shippingDetails': {
          '@type': 'OfferShippingDetails',
          'shippingRate': {
            '@type': 'MonetaryAmount',
            'value': '0',
            'currency': 'INR'
          },
          'shippingDestination': {
            '@type': 'DefinedRegion',
            'addressCountry': 'IN'
          },
          'deliveryTime': {
            '@type': 'ShippingDeliveryTime',
            'businessDays': {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            },
            'cutoffTime': '17:00:00+05:30',
            'handlingTime': {
              '@type': 'QuantitativeValue',
              'minValue': 1,
              'maxValue': 2,
              'unitCode': 'DAY'
            },
            'transitTime': {
              '@type': 'QuantitativeValue',
              'minValue': 2,
              'maxValue': 5,
              'unitCode': 'DAY'
            }
          }
        }
      }
    };

    this.setJsonLd(productSchema, 'product-json-ld');
  }

  /**
   * Inject rich Schema.org BreadcrumbList for enhanced search engine trail display
   */
  setBreadcrumbSchema(items: BreadcrumbItem[]) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url.startsWith('http') ? item.url : `${this.defaultDomain}${item.url.startsWith('/') ? '' : '/'}${item.url}`
      }))
    };

    this.setJsonLd(breadcrumbSchema, 'breadcrumbs-json-ld');
  }

  /**
   * Inject rich Schema.org FAQPage for FAQ rich snippets in Google search results
   */
  setFaqSchema(faqs: FaqItem[]) {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    this.setJsonLd(faqSchema, 'faq-json-ld');
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
