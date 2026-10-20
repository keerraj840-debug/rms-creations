import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ItemSourcingImageService } from './item-sourcing-image.service';
import { SupabaseService } from './supabase.service';
import { ImageProcessorService } from '../shared/ui/image-processor.service';

describe('ItemSourcingImageService', () => {
  let service: ItemSourcingImageService;
  let supabaseMock: any;
  let imageProcessorMock: any;

  beforeEach(() => {
    supabaseMock = {
      uploadFile: vi.fn().mockResolvedValue({ data: 'https://example.com/uploaded.jpg', error: null })
    };
    imageProcessorMock = {
      processAndOptimize: vi.fn().mockResolvedValue({
        file: new File([], 'test.jpg'),
        blob: new Blob([]),
        dataUrl: '',
        originalSizeBytes: 100,
        optimizedSizeBytes: 50,
        savedPercentage: 50,
        isLossless: false,
        compressionType: 'High-Quality Photography JPEG',
        width: 300,
        height: 300
      })
    };

    TestBed.configureTestingModule({
      providers: [
        ItemSourcingImageService,
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: ImageProcessorService, useValue: imageProcessorMock }
      ]
    });

    service = TestBed.inject(ItemSourcingImageService);
  });

  describe('cleanSearchQuery', () => {
    it('cleans sizes, parentheses, and unit specs from item name for clean image searching', () => {
      expect(service.cleanSearchQuery('Brass Pooja Diya (2.5 inch) 100g')).toBe('Brass Pooja Diya');
      expect(service.cleanSearchQuery('Ferrero Rocher [16 pcs] 200g')).toBe('Ferrero Rocher');
      expect(service.cleanSearchQuery('Premium Cashews (Kaju) 250 gm')).toBe('Premium Cashews');
      expect(service.cleanSearchQuery('Scented Candle 50ml')).toBe('Scented Candle');
    });

    it('handles empty or blank string gracefully', () => {
      expect(service.cleanSearchQuery('')).toBe('');
      expect(service.cleanSearchQuery('   ')).toBe('');
    });
  });

  describe('getCheapestPlatforms', () => {
    it('identifies craft & pooja items and recommends Meesho and IndiaMART', () => {
      const res = service.getCheapestPlatforms('Brass Pooja Diya');
      expect(res.category).toBe('craft_pooja');
      expect(res.topRecommendation).toContain('Meesho');
      expect(res.platforms.some(p => p.id === 'meesho' && p.isRecommended)).toBe(true);
      expect(res.platforms.some(p => p.id === 'google_shopping')).toBe(true);
    });

    it('identifies confectionery and recommends JioMart', () => {
      const res = service.getCheapestPlatforms('Ferrero Rocher Chocolate Box');
      expect(res.category).toBe('confectionery_fmcg');
      expect(res.topRecommendation).toContain('JioMart');
      expect(res.platforms.some(p => p.id === 'jiomart' && p.isRecommended)).toBe(true);
    });

    it('identifies packaging boxes & ribbons', () => {
      const res = service.getCheapestPlatforms('Satin Ribbon Gold 1 inch');
      expect(res.category).toBe('packaging_decor');
      expect(res.platforms.some(p => p.id === 'indiamart')).toBe(true);
    });

    it('generates price-asc search URLs with query parameter', () => {
      const res = service.getCheapestPlatforms('Brass Diya');
      const googleShop = res.platforms.find(p => p.id === 'google_shopping');
      expect(googleShop?.searchUrl).toContain('tbs=p_ord:p');
      const meesho = res.platforms.find(p => p.id === 'meesho');
      expect(meesho?.searchUrl).toContain('meesho.com/search');
    });
  });

  describe('calculateMargin', () => {
    it('calculates gross profit and margin percentage accurately', () => {
      const margin = service.calculateMargin(100, 40);
      expect(margin.profit).toBe(60);
      expect(margin.marginPercent).toBe(60);
      expect(margin.isProfitable).toBe(true);
    });

    it('flags unprofitability if sourcing cost exceeds item price', () => {
      const margin = service.calculateMargin(50, 75);
      expect(margin.profit).toBe(-25);
      expect(margin.isProfitable).toBe(false);
    });
  });

  describe('metadata embedding and parsing', () => {
    it('embeds metadata and parses it back without altering clean description', () => {
      const cleanDesc = 'Handcrafted solid brass diya with traditional engraving.';
      const meta = {
        image: 'https://example.com/diya.jpg',
        sourcingPlatform: 'Meesho',
        sourcingPrice: 28,
        sourcingUrl: 'https://meesho.com/s/12345'
      };

      const embedded = service.embedMetadataIntoDescription(cleanDesc, meta);
      expect(embedded).toContain(cleanDesc);
      expect(embedded).toContain('<!--rms-item-meta:');

      const parsed = service.extractMetadataFromDescription(embedded);
      expect(parsed.cleanDescription).toBe(cleanDesc);
      expect(parsed.image).toBe(meta.image);
      expect(parsed.sourcingPlatform).toBe('Meesho');
      expect(parsed.sourcingPrice).toBe(28);
      expect(parsed.sourcingUrl).toBe('https://meesho.com/s/12345');
    });

    it('handles description without metadata tags', () => {
      const parsed = service.extractMetadataFromDescription('Plain note without any tags');
      expect(parsed.cleanDescription).toBe('Plain note without any tags');
      expect(parsed.image).toBeUndefined();
    });
  });
});
