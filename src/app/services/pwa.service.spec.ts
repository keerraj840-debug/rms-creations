import { TestBed } from '@angular/core/testing';
import { PwaService } from './pwa.service';
import { PLATFORM_ID } from '@angular/core';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('PwaService', () => {
  let service: PwaService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(PwaService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created and expose current version', () => {
    expect(service).toBeTruthy();
    expect(service.currentVersion()).toBeTruthy();
    expect(service.showUpdateBanner()).toBe(false);
  });

  it('should update canInstall when beforeinstallprompt event is dispatched', () => {
    const mockPromptEvent = new Event('beforeinstallprompt') as any;
    mockPromptEvent.prompt = vi.fn().mockResolvedValue(undefined);
    mockPromptEvent.userChoice = Promise.resolve({ outcome: 'accepted' });

    window.dispatchEvent(mockPromptEvent);

    expect(service.canInstall()).toBe(true);
  });

  it('should prompt installation and handle user acceptance', async () => {
    const mockPromptEvent = new Event('beforeinstallprompt') as any;
    mockPromptEvent.prompt = vi.fn().mockResolvedValue(undefined);
    mockPromptEvent.userChoice = Promise.resolve({ outcome: 'accepted' });

    window.dispatchEvent(mockPromptEvent);

    const outcome = await service.promptInstall();
    expect(mockPromptEvent.prompt).toHaveBeenCalled();
    expect(outcome).toBe('accepted');
    expect(service.isInstalled()).toBe(true);
    expect(service.canInstall()).toBe(false);
  });

  it('should open guided installation modal when no native prompt event is available', async () => {
    // No beforeinstallprompt event was dispatched
    const outcome = await service.promptInstall();
    expect(outcome).toBe('guided');
    expect(service.showInstallGuide()).toBe(true);
  });

  it('should dismiss install prompt and set cooldown in localStorage', () => {
    service.canInstall.set(true);
    service.dismissInstallPrompt(5);

    expect(service.canInstall()).toBe(false);
    const cooldown = localStorage.getItem('rms_pwa_dismissed_until');
    expect(cooldown).toBeTruthy();
    expect(Number(cooldown)).toBeGreaterThan(Date.now());
  });

  it('should toggle install guide display', () => {
    expect(service.showInstallGuide()).toBe(false);
    service.toggleInstallGuide(true);
    expect(service.showInstallGuide()).toBe(true);
    service.toggleInstallGuide(false);
    expect(service.showInstallGuide()).toBe(false);
  });

  it('should dismiss update banner', () => {
    service.showUpdateBanner.set(true);
    service.dismissUpdateBanner();
    expect(service.showUpdateBanner()).toBe(false);
  });
});
