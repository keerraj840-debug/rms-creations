import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'top-offers/:category',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [{ category: 'friendship-day' }]
  },
  {
    path: 'hampers/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { slug: 'girls-hampers' },
      { slug: 'boys-hampers' },
      { slug: 'chocolate-hamper' }
    ]
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
