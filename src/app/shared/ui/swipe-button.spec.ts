import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi } from 'vitest';
import { SwipeButtonComponent } from './swipe-button.component';

describe('SwipeButtonComponent (Swipe to Place Order Draggable Button)', () => {
  it('initializes with default non-confirmed state', () => {
    const fixture = TestBed.createComponent(SwipeButtonComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isConfirmed).toBe(false);
    expect(component.isDragging).toBe(false);
    expect(component.dragPercentage).toBe(0);
    expect(component.currentX).toBe(4);
  });

  it('prevents dragging and emits nothing when disabled', () => {
    const fixture = TestBed.createComponent(SwipeButtonComponent);
    const component = fixture.componentInstance;
    component.disabled = true;
    fixture.detectChanges();

    const spy = vi.spyOn(component.onSwipeComplete, 'emit');

    // Simulate drag start on disabled
    component.onTouchStart({ touches: [{ clientX: 100 }] } as any);
    expect(component.isDragging).toBe(false);

    component.onMouseDown({ clientX: 100, preventDefault: vi.fn() } as any);
    expect(component.isDragging).toBe(false);

    component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(spy).not.toHaveBeenCalled();
  });

  it('resets slider back to 0 if drag finishes before 85% threshold', () => {
    const fixture = TestBed.createComponent(SwipeButtonComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const spy = vi.spyOn(component.onSwipeComplete, 'emit');

    // Setup mock elements
    component.trackRef = { nativeElement: { offsetWidth: 300 } } as any;
    component.knobRef = { nativeElement: { offsetWidth: 50 } } as any;

    // Start drag
    component.onMouseDown({ clientX: 10, preventDefault: vi.fn() } as any);
    expect(component.isDragging).toBe(true);

    // Drag small amount (e.g., 30px out of ~240px = ~12%)
    component.onMouseMove({ clientX: 40 } as any);
    expect(component.dragPercentage).toBeLessThan(0.85);

    // Release
    component.onMouseUp();
    expect(component.isDragging).toBe(false);
    expect(component.isConfirmed).toBe(false);
    expect(component.currentX).toBe(4);
    expect(spy).not.toHaveBeenCalled();
  });

  it('triggers onSwipeComplete and confirms when dragged >= 85%', () => {
    const fixture = TestBed.createComponent(SwipeButtonComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const spy = vi.spyOn(component.onSwipeComplete, 'emit');

    // Setup mock elements
    component.trackRef = { nativeElement: { offsetWidth: 300 } } as any;
    component.knobRef = { nativeElement: { offsetWidth: 50 } } as any;

    // Start drag
    component.onMouseDown({ clientX: 0, preventDefault: vi.fn() } as any);

    // Drag all the way to right (e.g., 290px)
    component.onMouseMove({ clientX: 290 } as any);
    expect(component.dragPercentage).toBeGreaterThanOrEqual(0.85);

    // Release
    component.onMouseUp();
    expect(component.isConfirmed).toBe(true);
    expect(component.dragPercentage).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('allows keyboard confirmation via Enter or Space key', () => {
    const fixture = TestBed.createComponent(SwipeButtonComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.trackRef = { nativeElement: { offsetWidth: 300 } } as any;
    component.knobRef = { nativeElement: { offsetWidth: 50 } } as any;

    const spy = vi.spyOn(component.onSwipeComplete, 'emit');

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const preventSpy = vi.spyOn(enterEvent, 'preventDefault');

    component.onKeyDown(enterEvent);
    expect(preventSpy).toHaveBeenCalled();
    expect(component.isConfirmed).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('resets confirmation and slider position via reset()', () => {
    const fixture = TestBed.createComponent(SwipeButtonComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.trackRef = { nativeElement: { offsetWidth: 300 } } as any;
    component.knobRef = { nativeElement: { offsetWidth: 50 } } as any;

    component.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(component.isConfirmed).toBe(true);

    component.reset();
    expect(component.isConfirmed).toBe(false);
    expect(component.currentX).toBe(4);
    expect(component.dragPercentage).toBe(0);
  });
});
