import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'cart' | 'success' | 'info' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  route?: string;
  onClick?: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  image?: string;
  price?: number;
  quantity?: number;
  action?: ToastAction;
  duration: number; // in milliseconds
  createdAt: number;
  isExiting?: boolean;
}

export interface CartToastPayload {
  title: string;
  image?: string;
  price?: number;
  quantity?: number;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly toastsSignal = signal<ToastItem[]>([]);
  public readonly toasts = this.toastsSignal.asReadonly();

  // Observable event stream if needed by legacy or reactive listeners
  private readonly toastEventsSubject = new Subject<ToastItem>();
  public readonly toastEvents$ = this.toastEventsSubject.asObservable();

  private readonly maxToasts = 3;
  private readonly defaultDuration = 4000;

  /**
   * Displays a rich, smart cart notification with product thumbnail, price and direct bag link.
   */
  showCartToast(item: CartToastPayload): string {
    const qty = item.quantity && item.quantity > 1 ? ` (${item.quantity})` : '';
    return this.show({
      type: 'cart',
      title: 'Added to Bag',
      message: `${item.title}${qty}`,
      image: item.image,
      price: item.price,
      quantity: item.quantity || 1,
      duration: 4500,
      action: {
        label: 'View Bag →',
        route: '/cart'
      }
    });
  }

  /**
   * Displays a success toast.
   */
  success(message: string, title: string = 'Success', action?: ToastAction): string {
    return this.show({ type: 'success', title, message, action });
  }

  /**
   * Displays an informational toast.
   */
  info(message: string, title: string = 'Notice', action?: ToastAction): string {
    return this.show({ type: 'info', title, message, action });
  }

  /**
   * Displays a warning toast.
   */
  warning(message: string, title: string = 'Warning', action?: ToastAction): string {
    return this.show({ type: 'warning', title, message, action });
  }

  /**
   * Displays an error toast.
   */
  error(message: string, title: string = 'Error', action?: ToastAction): string {
    return this.show({ type: 'error', title, message, duration: 6000, action });
  }

  /**
   * General show method for custom configurations.
   */
  show(config: {
    type?: ToastType;
    title?: string;
    message: string;
    image?: string;
    price?: number;
    quantity?: number;
    duration?: number;
    action?: ToastAction;
  }): string {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const duration = config.duration ?? this.defaultDuration;

    const newToast: ToastItem = {
      id,
      type: config.type ?? 'info',
      title: config.title ?? (config.type === 'cart' ? 'Added to Bag' : 'Notification'),
      message: config.message,
      image: config.image,
      price: config.price,
      quantity: config.quantity,
      action: config.action,
      duration,
      createdAt: Date.now(),
      isExiting: false
    };

    // Subtle tactile haptic pulse on mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Safe ignore
      }
    }

    // Keep up to maxToasts; dismiss oldest if exceeded
    const current = this.toastsSignal();
    let updated = [...current];
    if (updated.length >= this.maxToasts) {
      updated = updated.slice(updated.length - this.maxToasts + 1);
    }
    updated.push(newToast);
    this.toastsSignal.set(updated);
    this.toastEventsSubject.next(newToast);

    return id;
  }

  /**
   * Initiates exit animation and smoothly removes the toast.
   */
  dismiss(id: string) {
    const current = this.toastsSignal();
    const target = current.find(t => t.id === id);
    if (!target) return;

    // Mark as exiting for CSS transition
    this.toastsSignal.set(
      current.map(t => t.id === id ? { ...t, isExiting: true } : t)
    );

    // Completely remove after exit transition (260ms)
    setTimeout(() => {
      this.toastsSignal.set(this.toastsSignal().filter(t => t.id !== id));
    }, 260);
  }

  /**
   * Clears all toasts immediately.
   */
  clearAll() {
    this.toastsSignal.set([]);
  }
}
