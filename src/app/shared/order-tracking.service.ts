import { Injectable } from '@angular/core';

export interface OrderEntry {
  id: string;
  title: string;
  category: string;
  page: string;
  link: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class OrderTrackingService {
  private readonly storageKey = 'rms-order-tracker';

  recordOrder(entry: Omit<OrderEntry, 'id' | 'timestamp'>): OrderEntry {
    const orders = this.getOrders();
    const newEntry: OrderEntry = {
      ...entry,
      id: `${Date.now()}-${orders.length + 1}`,
      timestamp: new Date().toISOString()
    };

    orders.push(newEntry);
    this.saveOrders(orders);
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
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
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
