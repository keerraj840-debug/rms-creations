import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { sanitizeCsvCell } from '../utils/security.utils';

export interface OrderEntry {
  id: string;
  title: string;
  category: string;
  page: string;
  link: string;
  timestamp: string;
  price?: number;
  skipDbSync?: boolean;
}

@Injectable({ providedIn: 'root' })
export class OrderTrackingService {
  private readonly storageKey = 'rms-order-tracker';
  private supabase = inject(SupabaseService);

  recordOrder(entry: Omit<OrderEntry, 'id' | 'timestamp'>): OrderEntry {
    const orders = this.getOrders();
    const newEntry: OrderEntry = {
      ...entry,
      id: `${Date.now()}-${orders.length + 1}`,
      timestamp: new Date().toISOString()
    };

    orders.push(newEntry);
    this.saveOrders(orders);

    // Sync live order to Supabase purchase_order table only if not skipped and not a general website action
    if (!entry.skipDbSync && entry.category !== 'Website' && entry.category !== 'General') {
      try {
        const orderNum = `ORD-${Date.now().toString().slice(-5)}`;
        const price = entry.price || 199;
        this.supabase.from('purchase_order').insert({
          purchase_order_no: orderNum,
          purchase_order_date: new Date().toISOString(),
          purchase_order_status: 'confirmed',
          payable_amount: price,
          total_amount: price,
          shipping_remark: entry.title ? `${entry.title} (${entry.category || 'General'})` : entry.category,
          is_active: true
        }).then(({ error }) => {
          if (error) console.warn('Supabase purchase_order sync note:', error.message);
        });
      } catch (err) {
        console.warn('Failed to dispatch order to Supabase:', err);
      }
    }

    return newEntry;
  }

  getOrders(): OrderEntry[] {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as OrderEntry[]) : [];
    } catch {
      return [];
    }
  }

  downloadOrders(): void {
    const orders = this.getOrders();
    const csvRows = [
      ['id', 'title', 'category', 'page', 'link', 'timestamp'],
      ...orders.map((item) => [item.id, item.title, item.category, item.page, item.link, item.timestamp])
    ];

    const csvContent = csvRows
      .map((row) => row.map((value) => sanitizeCsvCell(value)).join(','))
      .join('\n');

    if (typeof window === 'undefined') {
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = 'rms-orders.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  clearOrders(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  private saveOrders(orders: OrderEntry[]): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(orders));
    }
  }
}
