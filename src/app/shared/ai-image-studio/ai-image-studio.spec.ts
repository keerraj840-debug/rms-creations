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

  it('should build context-aware banner prompt with negative space instructions', () => {
    const context: AiImageStudioContext = {
      targetType: 'banner',
      title: 'Diwali Festive Lights Hamper',
      description: 'Handcrafted dry fruits and brass diya set',
      gender: 'unisex'
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
    expect(prompt).toContain('panoramic promotional hero banner');
    expect(prompt).toContain('clean negative space on the left');
  });

  it('should build context-aware product hamper prompt', () => {
    const context: AiImageStudioContext = {
      targetType: 'product',
      title: 'Boutique Girls Gift Hamper',
      description: 'Pastel stationery and treats',
      gender: 'female'
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
    expect(prompt).toContain('partitioned keepsake box');
  });

  it('should generate synthetic artwork candidate with proper aspect ratio', async () => {
    const context: AiImageStudioContext = {
      targetType: 'category',
      title: 'Chocolate Hampers'
    };

    const candidate = await service.generateCandidate(
      'Prompt text',
      context,
      'Gourmet Chocolates',
      ['#57251C', '#9C4738'],
      '4:3',
      1,
      false
    );

    expect(candidate.aspectRatio).toBe('4:3');
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
