import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface PinCodeAvailability {
  pca_id?: number;
  pca_pin_code: string;
  pca_delivery_charges: number;
  pca_is_available: boolean;
  pca_state: string;
  pca_district: string;
  pca_delivery_charges_above_1kg: number;
  courier_service?: string;
  is_active?: boolean;
  creation_date?: string;
  updation_date?: string;
}

export interface DeliveryCheckResult {
  isServiceable: boolean;
  pinCode: string;
  state?: string;
  district?: string;
  courierService?: string;
  baseCharge: number;
  above1kgCharge: number;
  calculatedDeliveryFee: number;
  totalWeightKg: number;
  freeDeliveryApplied: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PinCodeAvailabilityService {
  private readonly supabase = inject(SupabaseService);

  // Free delivery threshold across store (e.g. Orders ₹499 and above enjoy Free Delivery on serviceable pins)
  public readonly freeDeliveryThreshold = 499;

  async checkDelivery(pinCode: string, subtotal: number = 0, totalWeightKg: number = 0.5): Promise<DeliveryCheckResult> {
    const cleanPin = (pinCode || '').trim().replace(/\D/g, '');

    if (!cleanPin || cleanPin.length !== 6) {
      return {
        isServiceable: false,
        pinCode: cleanPin,
        baseCharge: 0,
        above1kgCharge: 0,
        calculatedDeliveryFee: 0,
        totalWeightKg,
        freeDeliveryApplied: false,
        message: 'Please enter a valid 6-digit Indian postal PIN code.'
      };
    }

    try {
      const { data, error } = await this.supabase
        .from('pin_code_availability')
        .select('*')
        .eq('pca_pin_code', cleanPin)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error checking PIN code availability:', error.message);
      }

      if (!data || !data.pca_is_available) {
        return {
          isServiceable: false,
          pinCode: cleanPin,
          baseCharge: 0,
          above1kgCharge: 0,
          calculatedDeliveryFee: 0,
          totalWeightKg,
          freeDeliveryApplied: false,
          message: `Delivery is currently not available for PIN code ${cleanPin}. Please select another delivery address or contact RMS concierge.`
        };
      }

      const record: PinCodeAvailability = data;
      const baseCharge = Number(record.pca_delivery_charges) || 49;
      const above1kgCharge = Number(record.pca_delivery_charges_above_1kg) || 29;

      // Weight-based charge calculation rule:
      // Base charge covers up to 1.0 kg. Additional kg is charged per kg.
      let weightFee = baseCharge;
      if (totalWeightKg > 1.0) {
        const extraKg = Math.ceil(totalWeightKg - 1.0);
        weightFee += extraKg * above1kgCharge;
      }

      // Check free delivery threshold
      const isFreeDelivery = subtotal >= this.freeDeliveryThreshold;
      const finalDeliveryFee = isFreeDelivery ? 0 : weightFee;

      const locationText = [record.pca_district, record.pca_state].filter(Boolean).join(', ');
      const courierText = record.courier_service ? ` via ${record.courier_service}` : '';
      const feeText = isFreeDelivery ? 'FREE (Special Order Offer)' : `₹${finalDeliveryFee}`;

      return {
        isServiceable: true,
        pinCode: cleanPin,
        state: record.pca_state,
        district: record.pca_district,
        courierService: record.courier_service,
        baseCharge,
        above1kgCharge,
        calculatedDeliveryFee: finalDeliveryFee,
        totalWeightKg,
        freeDeliveryApplied: isFreeDelivery,
        message: `Delivery available to ${locationText}${courierText}. Delivery charge: ${feeText}.`
      };
    } catch (err: any) {
      return {
        isServiceable: false,
        pinCode: cleanPin,
        baseCharge: 0,
        above1kgCharge: 0,
        calculatedDeliveryFee: 0,
        totalWeightKg,
        freeDeliveryApplied: false,
        message: 'Could not verify delivery serviceability. Please try again.'
      };
    }
  }

  /* ------------------------------------------------------------------ */
  /* ADMIN CRUD OPERATIONS                                              */
  /* ------------------------------------------------------------------ */

  async getAllPinCodes(searchQuery: string = '', availableFilter: 'all' | 'available' | 'unavailable' = 'all'): Promise<PinCodeAvailability[]> {
    try {
      let query = this.supabase
        .from('pin_code_availability')
        .select('*')
        .eq('is_active', true)
        .order('pca_pin_code', { ascending: true });

      if (availableFilter === 'available') {
        query = query.eq('pca_is_available', true);
      } else if (availableFilter === 'unavailable') {
        query = query.eq('pca_is_available', false);
      }

      const { data, error } = await query;
      if (error) throw error;

      let list = (data as PinCodeAvailability[]) || [];
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        list = list.filter(p => 
          p.pca_pin_code.includes(q) || 
          p.pca_state?.toLowerCase().includes(q) || 
          p.pca_district?.toLowerCase().includes(q) ||
          p.courier_service?.toLowerCase().includes(q)
        );
      }

      return list;
    } catch (err) {
      console.error('Error fetching PIN codes:', err);
      return [];
    }
  }

  async getPinCodeById(id: number): Promise<PinCodeAvailability | null> {
    try {
      const { data, error } = await this.supabase
        .from('pin_code_availability')
        .select('*')
        .eq('pca_id', id)
        .single();

      if (error) throw error;
      return data as PinCodeAvailability;
    } catch {
      return null;
    }
  }

  async getById(id: number): Promise<PinCodeAvailability | null> {
    return this.getPinCodeById(id);
  }

  async create(pca: PinCodeAvailability): Promise<{ data: PinCodeAvailability | null; error?: string }> {
    return this.savePinCode(pca);
  }

  async update(id: number, pca: Partial<PinCodeAvailability>): Promise<{ data: PinCodeAvailability | null; error?: string }> {
    return this.savePinCode({ ...pca, pca_id: id } as PinCodeAvailability);
  }

  async savePinCode(pca: PinCodeAvailability): Promise<{ data: PinCodeAvailability | null; error?: string }> {
    const pin = (pca.pca_pin_code || '').trim().replace(/\D/g, '');
    if (!pin || pin.length !== 6) {
      return { data: null, error: 'Valid 6-digit PIN code is required.' };
    }

    try {
      const payload: any = {
        pca_pin_code: pin,
        pca_delivery_charges: Number(pca.pca_delivery_charges) || 49,
        pca_is_available: Boolean(pca.pca_is_available),
        pca_state: (pca.pca_state || '').trim(),
        pca_district: (pca.pca_district || '').trim(),
        pca_delivery_charges_above_1kg: Number(pca.pca_delivery_charges_above_1kg) || 29,
        courier_service: (pca.courier_service || 'Express Courier').trim(),
        is_active: true,
        updation_date: new Date().toISOString()
      };

      if (pca.pca_id) {
        const { data, error } = await this.supabase
          .from('pin_code_availability')
          .update(payload)
          .eq('pca_id', pca.pca_id)
          .select()
          .single();

        if (error) throw error;
        return { data: data as PinCodeAvailability };
      } else {
        payload.creation_date = new Date().toISOString();
        const { data, error } = await this.supabase
          .from('pin_code_availability')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        return { data: data as PinCodeAvailability };
      }
    } catch (err: any) {
      return { data: null, error: err?.message || 'Error saving PIN code configuration.' };
    }
  }

  async toggleAvailability(id: number, currentStatus: boolean): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('pin_code_availability')
        .update({
          pca_is_available: !currentStatus,
          updation_date: new Date().toISOString()
        })
        .eq('pca_id', id);

      return !error;
    } catch {
      return false;
    }
  }

  async deletePinCode(id: number): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('pin_code_availability')
        .update({ is_active: false, updation_date: new Date().toISOString() })
        .eq('pca_id', id);

      return !error;
    } catch {
      return false;
    }
  }
}
