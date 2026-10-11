import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface CustomerAddress {
  customer_address_id?: number;
  user_id?: number;
  address_type: 'Home' | 'Work' | 'Other';
  address: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  is_default?: boolean;
  is_active?: boolean;
  creation_date?: string;
  updation_date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerAddressService {
  private readonly supabase = inject(SupabaseService);

  validateAddress(addr: Partial<CustomerAddress>): { valid: boolean; error?: string } {
    if (!addr.address || !addr.address.trim()) {
      return { valid: false, error: 'Street address / building details are required.' };
    }
    if (!addr.city || !addr.city.trim()) {
      return { valid: false, error: 'City is required.' };
    }
    if (!addr.state || !addr.state.trim()) {
      return { valid: false, error: 'State is required.' };
    }
    if (!addr.pin_code || !addr.pin_code.trim()) {
      return { valid: false, error: 'Postal PIN code is required.' };
    }
    const cleanPin = addr.pin_code.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      return { valid: false, error: 'Please enter a valid 6-digit Indian PIN code.' };
    }
    return { valid: true };
  }

  async getCustomerAddresses(userId: number): Promise<CustomerAddress[]> {
    if (!userId) return [];

    try {
      const { data, error } = await this.supabase
        .from('customer_address')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('customer_address_id', { ascending: false });

      if (error) {
        console.error('Error fetching customer addresses:', error.message);
        return [];
      }
      return (data as CustomerAddress[]) || [];
    } catch (err) {
      console.error('Error querying customer_address:', err);
      return [];
    }
  }

  async saveAddress(userId: number, address: CustomerAddress): Promise<{ data: CustomerAddress | null; error?: string }> {
    if (!userId) {
      return { data: null, error: 'User must be authenticated to save address.' };
    }

    const validation = this.validateAddress(address);
    if (!validation.valid) {
      return { data: null, error: validation.error };
    }

    try {
      const payload: any = {
        user_id: userId,
        address_type: address.address_type || 'Home',
        address: address.address.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        country: address.country?.trim() || 'India',
        pin_code: address.pin_code.trim(),
        is_default: Boolean(address.is_default),
        is_active: true,
        updation_date: new Date().toISOString()
      };

      // If set as default, unset other addresses' is_default
      if (payload.is_default) {
        await this.supabase
          .from('customer_address')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      if (address.customer_address_id) {
        // Enforce ownership: only update if address belongs to userId
        const { data, error } = await this.supabase
          .from('customer_address')
          .update(payload)
          .eq('customer_address_id', address.customer_address_id)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return { data: data as CustomerAddress };
      } else {
        payload.creation_date = new Date().toISOString();
        const { data, error } = await this.supabase
          .from('customer_address')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        return { data: data as CustomerAddress };
      }
    } catch (err: any) {
      return { data: null, error: err?.message || 'Failed to save address.' };
    }
  }

  async deleteAddress(userId: number, addressId: number): Promise<{ success: boolean; error?: string }> {
    if (!userId || !addressId) return { success: false, error: 'Invalid address request.' };

    try {
      // Enforce ownership: only soft delete if address belongs to user
      const { error } = await this.supabase
        .from('customer_address')
        .update({ is_active: false, updation_date: new Date().toISOString() })
        .eq('customer_address_id', addressId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete address.' };
    }
  }
}
