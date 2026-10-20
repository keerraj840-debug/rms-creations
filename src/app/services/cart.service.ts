import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { ToastService } from './toast.service';

export interface CartItem {
  id: string;
  productId?: number;
  title: string;
  price: number;
  image: string;
  category?: string;
  quantity: number;
  notes?: string;
  weight_kg?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly localStorage = inject(LocalStorageService);
  private readonly toastService = inject(ToastService);
  private readonly STORAGE_KEY = 'rms_shopping_cart';

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  private toastMessageSubject = new BehaviorSubject<string | null>(null);
  public toastMessage$ = this.toastMessageSubject.asObservable();

  private verifiedDeliveryFee: number | null = null;

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const saved = this.localStorage.getItem<CartItem[]>(this.STORAGE_KEY);
    if (Array.isArray(saved)) {
      this.itemsSubject.next(saved);
    }
  }

  private saveCart(items: CartItem[]) {
    this.itemsSubject.next(items);
    this.localStorage.setItem(this.STORAGE_KEY, items);
  }

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  get totalItemsCount(): number {
    return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  }

  get totalWeightKg(): number {
    return this.items.reduce((sum, item) => sum + ((item.weight_kg || 0.5) * (item.quantity || 1)), 0);
  }

  setVerifiedDeliveryFee(fee: number | null) {
    this.verifiedDeliveryFee = fee;
  }

  get hasHamper(): boolean {
    return this.items.some(item =>
      item.category === 'Custom Hamper' ||
      item.category?.toLowerCase().includes('hamper') ||
      item.title?.toLowerCase().includes('hamper')
    );
  }

  get deliveryFee(): number {
    if (this.subtotal === 0) return 0;
    if (this.verifiedDeliveryFee !== null) {
      return this.verifiedDeliveryFee;
    }
    // Standard PIN-code delivery applies (base ₹49 before PIN verification)
    return 49;
  }

  get finalTotal(): number {
    return this.subtotal + this.deliveryFee;
  }

  addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1, notes?: string) {
    const current = [...this.items];
    const existingIndex = current.findIndex(i => i.id === item.id || (item.productId && i.productId === item.productId));

    if (existingIndex > -1) {
      current[existingIndex].quantity += quantity;
      if (notes) current[existingIndex].notes = notes;
    } else {
      current.push({
        ...item,
        quantity: Math.max(1, quantity),
        notes: notes || ''
      });
    }

    this.saveCart(current);
    this.toastService.showCartToast({
      title: item.title,
      image: item.image,
      price: item.price,
      quantity,
      category: item.category
    });
    this.showToast(`Added "${item.title}" to your cart!`);
  }

  updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const current = this.items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });

    this.saveCart(current);
  }

  removeFromCart(itemId: string) {
    const removedItem = this.items.find(item => item.id === itemId);
    const current = this.items.filter(item => item.id !== itemId);
    this.saveCart(current);
    this.toastService.info(
      removedItem ? `Removed "${removedItem.title}" from your bag` : 'Item removed from bag',
      'Bag Updated'
    );
    this.showToast('Item removed from cart');
  }

  clearCart() {
    this.saveCart([]);
    this.toastService.info('Your shopping bag has been cleared', 'Bag Cleared');
  }

  private showToast(msg: string) {
    this.toastMessageSubject.next(msg);
    setTimeout(() => {
      if (this.toastMessageSubject.value === msg) {
        this.toastMessageSubject.next(null);
      }
    }, 2800);
  }
}
