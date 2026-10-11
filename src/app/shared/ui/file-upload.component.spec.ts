import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileUploadComponent } from './file-upload.component';
import { ImageProcessorService } from './image-processor.service';
import { SupabaseService } from '../../services/supabase.service';

describe('FileUploadComponent (Unified Image Upload)', () => {
  let component: FileUploadComponent;
  let mockProcessor: Partial<ImageProcessorService>;
  let mockSupabase: Partial<SupabaseService>;

  beforeEach(async () => {
    mockProcessor = {
      validateFile: vi.fn().mockResolvedValue({ isValid: true }),
      processAndOptimize: vi.fn().mockResolvedValue({
        file: new File([], 'banner.jpg', { type: 'image/jpeg' }),
        blob: new Blob([]),
        dataUrl: 'data:image/jpeg;base64,mock',
        originalSizeBytes: 500000,
        optimizedSizeBytes: 250000,
        savedPercentage: 50,
        isLossless: false,
        compressionType: 'High-Quality Photography JPEG',
        width: 1600,
        height: 900
      })
    };

    mockSupabase = {
      uploadFile: vi.fn().mockResolvedValue({ data: 'https://example.com/banner.jpg', error: null })
    };

    await TestBed.configureTestingModule({
      imports: [FileUploadComponent],
      providers: [
        { provide: ImageProcessorService, useValue: mockProcessor },
        { provide: SupabaseService, useValue: mockSupabase }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
  });

  it('correctly reports aspect ratio label for 16:9 banners and 1:1 items/products/categories', () => {
    component.aspectRatio = 16 / 9;
    expect(component.aspectRatioLabel).toBe('16:9 Banner');

    component.aspectRatio = 1;
    expect(component.aspectRatioLabel).toBe('1:1 Square');
  });

  it('adjusts zoom controls within bounds (0.5x to 3.0x)', () => {
    expect(component.currentScale).toBe(1);

    component.zoomIn();
    expect(component.currentScale).toBeCloseTo(1.1);

    component.resetZoom();
    expect(component.currentScale).toBe(1);

    component.zoomOut();
    expect(component.currentScale).toBeCloseTo(0.9);
  });

  it('opens cropper modal when a valid file is selected', async () => {
    const validFile = new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], 'promo.jpg', { type: 'image/jpeg' });
    await component.handleIncomingFile(validFile);

    expect(component.showCropperModal).toBe(true);
    expect(component.activeFileForCropping).toBe(validFile);
    expect(component.errorMessage).toBe('');
  });

  it('cancels and closes the crop modal cleanly without modifying state', () => {
    component.showCropperModal = true;
    component.activeFileForCropping = new File([], 'temp.jpg');
    component.cancelCrop();

    expect(component.showCropperModal).toBe(false);
    expect(component.activeFileForCropping).toBeNull();
  });

  it('clears the uploaded file and emits removed event', () => {
    const spy = vi.fn();
    component.removed.subscribe(spy);

    component.lastProcessedResult = {} as any;
    component.previewUrl = 'data:...';
    component.uploadedUrl = 'https://...';

    component.clearFile();

    expect(component.lastProcessedResult).toBeNull();
    expect(component.previewUrl).toBeNull();
    expect(component.uploadedUrl).toBeNull();
    expect(spy).toHaveBeenCalled();
  });
});
