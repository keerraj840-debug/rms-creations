import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';
import { LogoutModalComponent } from './logout-modal.component';
import { AuthService } from '../../services/auth.service';

describe('LogoutModalComponent', () => {
  let component: LogoutModalComponent;
  let fixture: ComponentFixture<LogoutModalComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      showLogoutModal: signal(false),
      isLoggingOut: signal(false),
      promptLogout: vi.fn(() => mockAuthService.showLogoutModal.set(true)),
      cancelLogout: vi.fn(() => mockAuthService.showLogoutModal.set(false)),
      confirmLogout: vi.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [LogoutModalComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not render open modal initially when showLogoutModal is false', () => {
    expect(component.isOpen).toBe(false);
    const modalElement = fixture.nativeElement.querySelector('app-modal');
    expect(modalElement).toBeTruthy();
  });

  it('should report isOpen as true when authService.showLogoutModal is true', () => {
    mockAuthService.showLogoutModal.set(true);
    expect(component.isOpen).toBe(true);
  });

  it('should trigger cancelLogout when Cancel is called', () => {
    component.cancelLogout();
    expect(mockAuthService.cancelLogout).toHaveBeenCalled();
  });

  it('should trigger confirmLogout when Sign Out is confirmed', () => {
    component.confirmLogout();
    expect(mockAuthService.confirmLogout).toHaveBeenCalled();
  });
});
