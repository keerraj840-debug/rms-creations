import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { ToastContainerComponent } from './toast-container.component';
import { ToastService } from '../../services/toast.service';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
      providers: [
        ToastService,
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    toastService.clearAll();
    fixture.detectChanges();
  });

  afterEach(() => {
    toastService.clearAll();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render nothing when there are no active toasts', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.toast-card')).toBeNull();
  });

  it('should render rich toast card when toast is triggered', () => {
    toastService.showCartToast({
      title: 'Luxury Diya Set',
      price: 499,
      image: 'test-diya.jpg',
      quantity: 1
    });

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const card = compiled.querySelector('.toast-card');
    expect(card).not.toBeNull();
    expect(card?.textContent).toContain('Added to Bag');
    expect(card?.textContent).toContain('Luxury Diya Set');
    expect(card?.textContent).toContain('₹499');
    expect(card?.textContent).toContain('View Bag →');

    const img = card?.querySelector('img');
    expect(img?.getAttribute('src')).toBe('test-diya.jpg');
  });

  it('should position above bottom nav when hideBottomNav is false', () => {
    component.hideBottomNav = false;
    toastService.show({ message: 'Hello World' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('[role="region"]');
    expect(container?.classList.contains('bottom-20')).toBe(true);
  });

  it('should adjust to bottom-5 when hideBottomNav is true', () => {
    component.hideBottomNav = true;
    toastService.show({ message: 'Hello World' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('[role="region"]');
    expect(container?.classList.contains('bottom-5')).toBe(true);
  });

  it('should pause countdown when hovered or touched', () => {
    const id = toastService.show({ message: 'Hover Test', duration: 1000 });
    fixture.detectChanges();

    const progressBefore = component.getProgress(id);
    component.pauseTimer(id);

    vi.advanceTimersByTime(200);
    const progressPaused = component.getProgress(id);
    expect(progressPaused).toBe(progressBefore);

    component.resumeTimer(id);
    vi.advanceTimersByTime(100);
    const progressResumed = component.getProgress(id);
    expect(progressResumed).toBeLessThan(progressBefore);
  });

  it('should dismiss toast when dismiss button is clicked', () => {
    const id = toastService.show({ message: 'Click Dismiss' });
    fixture.detectChanges();

    component.dismiss(id);
    vi.advanceTimersByTime(300);
    fixture.detectChanges();

    expect(toastService.toasts().length).toBe(0);
  });
});
