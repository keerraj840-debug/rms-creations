import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AiImageStudioService, AiImageStudioContext } from './ai-image-studio.service';
import { AiImageStudioComponent } from './ai-image-studio.component';
import { SupabaseService } from '../../services/supabase.service';

describe('AiImageStudioService', () => {
  let service: AiImageStudioService;
  let supabaseMock: any;

  beforeEach(() => {
    supabaseMock = {
      uploadFile: vi.fn().mockResolvedValue({ data: 'https://example.com/asset.jpg', error: null })
    };

    TestBed.configureTestingModule({
      providers: [
        AiImageStudioService,
        { provide: SupabaseService, useValue: supabaseMock }
      ]
    });

    service = TestBed.inject(AiImageStudioService);
  });

  it('should build context-aware banner prompt with negative space and brand aesthetics', () => {
    const context: AiImageStudioContext = {
      targetType: 'banner',
      title: 'Diwali Festive Lights Hamper',
      description: 'Handcrafted dry fruits and brass diya set',
      gender: 'unisex',
      fromDate: '2026-10-15',
      toDate: '2026-11-05'
    };

    const prompt = service.buildPrompt(
      context,
      'Festive & Auspicious',
      'Festive Saffron',
      ['#E65100', '#FFB300'],
      'Premium Studio Photography',
      '16:9'
    );

    expect(prompt).toContain('Diwali Festive Lights Hamper');
    expect(prompt).toContain('commercial hero banner');
    expect(prompt).toContain('CRITICAL NEGATIVE SPACE');
    expect(prompt).toContain('RMS Creations brand aesthetics');
    expect(prompt).toContain('2026-10-15');
  });

  it('should build context-aware category cover prompt', () => {
    const context: AiImageStudioContext = {
      targetType: 'category',
      title: 'Luxury Keepsake Hampers',
      description: 'Handcrafted festival boxes',
      gender: 'festive'
    };

    const prompt = service.buildPrompt(
      context,
      'Luxury Gifting',
      'Royal Gold & Ivory',
      ['#D4AF37', '#FAF7F2'],
      'Premium Studio Photography',
      '1:1'
    );

    expect(prompt).toContain('Square 1:1 high-end collection cover tile');
    expect(prompt).toContain('Luxury Keepsake Hampers');
    expect(prompt).toContain('RMS Creations website gallery assets');
  });

  it('should build context-aware product hamper prompt with partitioned box details', () => {
    const context: AiImageStudioContext = {
      targetType: 'product',
      title: 'Boutique Girls Gift Hamper',
      description: 'Pastel stationery and treats',
      gender: 'female',
      price: 249
    };

    const prompt = service.buildPrompt(
      context,
      'Romantic & Anniversary',
      'Pastel Charm',
      ['#F8BBD0', '#E1BEE7'],
      'Premium Studio Photography',
      '1:1'
    );

    expect(prompt).toContain('Boutique Girls Gift Hamper');
    expect(prompt).toContain('female');
    expect(prompt).toContain('partitioned compartments');
    expect(prompt).toContain('₹249');
  });

  it('should build context-aware individual item prompt with pedestal presentation', () => {
    const context: AiImageStudioContext = {
      targetType: 'item',
      title: 'Artisanal Scented Soy Candle',
      description: 'Vanilla and lavender aromatics',
      price: 99
    };

    const prompt = service.buildPrompt(
      context,
      'Minimalist & Modern',
      'Midnight Navy',
      ['#0D1B2A', '#415A77'],
      'Premium Studio Photography',
      '1:1'
    );

    expect(prompt).toContain('Square 1:1 clean commercial studio product photograph');
    expect(prompt).toContain('Artisanal Scented Soy Candle');
    expect(prompt).toContain('cream stone pedestal');
    expect(prompt).toContain('₹99');
  });

  it('should generate synthetic artwork candidate with proper 16:9 banner ratio', async () => {
    const context: AiImageStudioContext = {
      targetType: 'banner',
      title: 'Ganesh Utsav Mega Sale'
    };

    const candidate = await service.generateCandidate(
      'Prompt text',
      context,
      'Festive & Auspicious',
      ['#E65100', '#FFB300'],
      '16:9',
      1,
      true
    );

    expect(candidate.aspectRatio).toBe('16:9');
    expect(candidate.dataUrl).toContain('data:image/');
    expect(candidate.id).toBeTruthy();
  });

  it('should generate synthetic artwork candidate with proper 1:1 square ratio for categories and items', async () => {
    const context: AiImageStudioContext = {
      targetType: 'category',
      title: 'Chocolate Hampers'
    };

    const candidate = await service.generateCandidate(
      'Prompt text',
      context,
      'Gourmet Chocolates',
      ['#57251C', '#9C4738'],
      '1:1',
      1,
      false
    );

    expect(candidate.aspectRatio).toBe('1:1');
    expect(candidate.dataUrl).toContain('data:image/');
    expect(candidate.id).toBeTruthy();
  });
});

describe('AiImageStudioComponent', () => {
  let component: AiImageStudioComponent;
  let serviceMock: any;

  beforeEach(() => {
    serviceMock = {
      buildPrompt: vi.fn().mockReturnValue('Synthetic prompt'),
      generateCandidate: vi.fn().mockResolvedValue({
        id: 'c1',
        dataUrl: 'data:image/jpeg;base64,mock',
        promptUsed: 'Prompt',
        theme: 'Luxury',
        aspectRatio: '1:1',
        timestamp: 1234
      }),
      uploadGeneratedImage: vi.fn().mockResolvedValue('https://example.com/uploaded.jpg')
    };

    TestBed.configureTestingModule({
      imports: [AiImageStudioComponent],
      providers: [
        { provide: AiImageStudioService, useValue: serviceMock }
      ]
    });

    const fixture = TestBed.createComponent(AiImageStudioComponent);
    component = fixture.componentInstance;
  });

  it('should auto-configure 16:9 aspect ratio when opened from banner context', () => {
    component.context = {
      targetType: 'banner',
      title: 'Ganesh Utsav Sale'
    };
    component.isOpen = true;
    component.ngOnChanges({
      context: { currentValue: component.context, previousValue: null, firstChange: true, isFirstChange: () => true }
    });

    expect(component.selectedAspectRatio).toBe('16:9');
    expect(component.selectedTheme).toBe('Festive & Auspicious');
  });

  it('should auto-configure 1:1 aspect ratio when opened from category or product context', () => {
    component.context = {
      targetType: 'category',
      title: 'Gourmet Truffles'
    };
    component.isOpen = true;
    component.ngOnChanges({
      context: { currentValue: component.context, previousValue: null, firstChange: true, isFirstChange: () => true }
    });

    expect(component.selectedAspectRatio).toBe('1:1');
    expect(component.selectedTheme).toBe('Gourmet Chocolates');
  });

  it('should prompt overwrite confirmation if entity has existing image', () => {
    component.context = {
      targetType: 'product',
      title: 'Test Hamper',
      existingImageUrl: 'https://example.com/old-cover.jpg'
    };
    component.selectedCandidate = {
      id: 'c1',
      dataUrl: 'data:image/jpeg;base64,mock',
      promptUsed: 'Prompt',
      theme: 'Luxury',
      aspectRatio: '1:1',
      timestamp: 1234
    };

    component.confirmApplySelected();
    expect(component.showOverwriteModal).toBe(true);
  });

  it('should finalize application and emit public URL upon user confirmation', async () => {
    const applySpy = vi.spyOn(component.applyImage, 'emit');
    const closeSpy = vi.spyOn(component.close, 'emit');

    component.selectedCandidate = {
      id: 'c1',
      dataUrl: 'data:image/jpeg;base64,mock',
      promptUsed: 'Prompt',
      theme: 'Luxury',
      aspectRatio: '1:1',
      timestamp: 1234
    };

    await component.finalizeApply();

    expect(serviceMock.uploadGeneratedImage).toHaveBeenCalled();
    expect(applySpy).toHaveBeenCalledWith('https://example.com/uploaded.jpg');
    expect(closeSpy).toHaveBeenCalled();
  });
});
