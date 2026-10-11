import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get items', () => {
    service.setItem('test_key', { role: 'admin' });
    const result = service.getItem<{ role: string }>('test_key');
    expect(result).toEqual({ role: 'admin' });
  });

  it('should remove items', () => {
    service.setItem('test_key', 'val');
    service.removeItem('test_key');
    expect(service.getItem('test_key')).toBeNull();
  });

  it('should return null for non-existing items', () => {
    expect(service.getItem('unknown')).toBeNull();
  });
});
