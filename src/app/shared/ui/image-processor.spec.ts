import { describe, it, expect, beforeEach } from 'vitest';
import { ImageProcessorService } from './image-processor.service';

describe('ImageProcessorService (File Upload & Compression)', () => {
  let service: ImageProcessorService;

  beforeEach(() => {
    service = new ImageProcessorService();
  });

  it('strictly accepts only JPG, JPEG, and PNG file extensions', async () => {
    // Valid extensions
    const validJpg = new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], 'hamper.jpg', { type: 'image/jpeg' });
    const validJpeg = new File([new Uint8Array([0xff, 0xd8, 0xff, 0xe0])], 'hamper.jpeg', { type: 'image/jpeg' });
    const validPng = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], 'box.png', { type: 'image/png' });

    expect((await service.validateFile(validJpg)).isValid).toBe(true);
    expect((await service.validateFile(validJpeg)).isValid).toBe(true);
    expect((await service.validateFile(validPng)).isValid).toBe(true);

    // Invalid extensions (GIF, SVG, WEBP, TXT)
    const invalidGif = new File([new Uint8Array([0x47, 0x49, 0x46])], 'animation.gif', { type: 'image/gif' });
    const invalidWebp = new File([new Uint8Array([0x52, 0x49, 0x46, 0x46])], 'photo.webp', { type: 'image/webp' });
    const invalidSvg = new File([new Uint8Array([0x3c, 0x73, 0x76, 0x67])], 'icon.svg', { type: 'image/svg+xml' });

    expect((await service.validateFile(invalidGif)).isValid).toBe(false);
    expect((await service.validateFile(invalidWebp)).isValid).toBe(false);
    expect((await service.validateFile(invalidSvg)).isValid).toBe(false);
  });

  it('rejects files exceeding the mandatory 1 MB size limit', async () => {
    // 1.5 MB dummy content
    const oversizedBytes = new Uint8Array(1.5 * 1024 * 1024);
    oversizedBytes[0] = 0xff;
    oversizedBytes[1] = 0xd8;
    oversizedBytes[2] = 0xff;
    const oversizedFile = new File([oversizedBytes], 'large-photo.jpg', { type: 'image/jpeg' });

    const result = await service.validateFile(oversizedFile);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('exceeds the mandatory maximum limit of 1 MB');
  });

  it('rejects corrupted or spoofed files with invalid binary magic headers', async () => {
    // A file named .jpg but containing plain text instead of JPEG magic numbers
    const spoofedFile = new File([new TextEncoder().encode('fake image content')], 'spoofed.jpg', { type: 'image/jpeg' });

    const result = await service.validateFile(spoofedFile);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('Invalid file content');
  });

  it('correctly reports compression type and never labels lossy JPEG as lossless', async () => {
    const pngBlob = new Blob([new Uint8Array(200)], { type: 'image/png' });
    const resultPng = await service.processAndOptimize(pngBlob, 'logo.png', 1, 200);
    expect(resultPng.compressionType).toBe('Lossless PNG');
    expect(resultPng.isLossless).toBe(true);

    const jpegBlob = new Blob([new Uint8Array(200)], { type: 'image/jpeg' });
    const resultJpeg = await service.processAndOptimize(jpegBlob, 'photo.jpg', 1, 200);
    expect(resultJpeg.compressionType).toBe('High-Quality Photography JPEG');
    expect(resultJpeg.isLossless).toBe(false);
  });
});
