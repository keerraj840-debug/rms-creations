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
  isHamperDelivery?: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PinCodeAvailabilityService {
  private readonly supabase = inject(SupabaseService);

  // Free delivery threshold across store for standard catalog items
  public readonly freeDeliveryThreshold = 499;

  // Ratnagiri Taluka postal PIN codes list (H.O, Kutchery, Shirgaon, Pawas, Hatkhamba, Jaigad/Ganpatipule, Malgund, Tiware, Ranpar)
  public readonly ratnagiriTalukaPinCodes = new Set([
    '415612', // Ratnagiri H.O, City, Nachane, Kuwarbav, Shivaji Nagar, Rahatagar
    '415613', // Shirgaon, Mirya, Kasarveli
    '415615', // Hatkhamba, Pali, Tarval
    '415616', // Pawas, Bhatye, Golap
    '415617', // Ganpatipule, Jaigad, Chafe
    '415620', // Kotawade, Malgund
    '415629', // Tiware, Kondye
    '415639', // Ratnagiri Kutchery, Zadgaon, Mirjole MIDC
    '415640'  // Ranpar, Finolex Power Plant
  ]);

  isRatnagiriTaluka(pinCode: string): boolean {
    const clean = (pinCode || '').trim().replace(/\D/g, '');
    return this.ratnagiriTalukaPinCodes.has(clean);
  }

  async checkDelivery(
    pinCode: string,
    subtotal: number = 0,
    totalWeightKg: number = 0.5,
    hasHamper: boolean = false
  ): Promise<DeliveryCheckResult> {
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

      if (data && data.pca_is_available === false) {
        return {
          isServiceable: false,
          pinCode: cleanPin,
          baseCharge: 0,
          above1kgCharge: 0,
          calculatedDeliveryFee: 0,
          totalWeightKg,
          freeDeliveryApplied: false,
          message: `Delivery is currently not available for PIN code ${cleanPin}. Please select another delivery address.`
        };
      }

      // Valid Indian postal PIN code prefix range check (100000 to 899999)
      const pinNum = parseInt(cleanPin, 10);
      const isValidIndianPin = pinNum >= 100000 && pinNum <= 899999;

      if (!data && !isValidIndianPin) {
        return {
          isServiceable: false,
          pinCode: cleanPin,
          baseCharge: 0,
          above1kgCharge: 0,
          calculatedDeliveryFee: 0,
          totalWeightKg,
          freeDeliveryApplied: false,
          message: `Delivery is currently not available for PIN code ${cleanPin}. Please select a valid Indian delivery address.`
        };
      }

      const isRtnTaluka = this.isRatnagiriTaluka(cleanPin);
      const defaultBase = isRtnTaluka ? 30 : 49;
      const defaultAbove1kg = isRtnTaluka ? 20 : 29;

      const baseCharge = data && data.pca_delivery_charges !== null && data.pca_delivery_charges !== undefined
        ? Number(data.pca_delivery_charges)
        : defaultBase;
      const above1kgCharge = data && data.pca_delivery_charges_above_1kg !== null && data.pca_delivery_charges_above_1kg !== undefined
        ? Number(data.pca_delivery_charges_above_1kg)
        : defaultAbove1kg;
      const state = data?.pca_state || 'Maharashtra';
      const district = data?.pca_district || (isRtnTaluka ? 'Ratnagiri (Taluka)' : 'Express Zone');
      const courierService = data?.courier_service || (isRtnTaluka ? 'Local Express Delivery' : 'Pan-India Express Courier');

      // Weight-based charge calculation rule:
      // Base charge covers up to 1.0 kg. Additional kg is charged per kg.
      let weightFee = baseCharge;
      if (totalWeightKg > 1.0) {
        const extraKg = Math.ceil(totalWeightKg - 1.0);
        weightFee += extraKg * above1kgCharge;
      }

      // Check free delivery threshold:
      // Orders containing hampers do not qualify for storewide free shipping;
      // PIN-code delivery charges are always applied for hampers.
      const isFreeDelivery = !hasHamper && subtotal >= this.freeDeliveryThreshold;
      const finalDeliveryFee = isFreeDelivery ? 0 : weightFee;

      const locationText = [district, state].filter(Boolean).join(', ');
      const courierText = courierService ? ` via ${courierService}` : '';
      const feeText = isFreeDelivery ? 'FREE (Special Offer)' : `₹${finalDeliveryFee}`;
      const hamperNote = hasHamper ? ' (Hamper parcel PIN-code shipping)' : '';

      return {
        isServiceable: true,
        pinCode: cleanPin,
        state,
        district,
        courierService,
        baseCharge,
        above1kgCharge,
        calculatedDeliveryFee: finalDeliveryFee,
        totalWeightKg,
        freeDeliveryApplied: isFreeDelivery,
        isHamperDelivery: hasHamper,
        message: `Delivery available to ${locationText}${courierText}. Delivery charge: ${feeText}${hamperNote}.`
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

  /**
   * Batch setups all 9 Ratnagiri Taluka postal PIN codes with ₹30 delivery charge
   */
  async setupRatnagiriTalukaPinCodes(): Promise<{ count: number; error?: string }> {
    const list = [
      { pin: '415612', name: 'Ratnagiri (City / H.O / Kuwarbav)' },
      { pin: '415613', name: 'Ratnagiri (Shirgaon / Mirya)' },
      { pin: '415615', name: 'Ratnagiri (Hatkhamba / Pali)' },
      { pin: '415616', name: 'Ratnagiri (Pawas / Bhatye / Golap)' },
      { pin: '415617', name: 'Ratnagiri (Jaigad / Ganpatipule)' },
      { pin: '415620', name: 'Ratnagiri (Kotawade / Malgund)' },
      { pin: '415629', name: 'Ratnagiri (Tiware / Kondye)' },
      { pin: '415639', name: 'Ratnagiri (Kutchery / Zadgaon / MIDC)' },
      { pin: '415640', name: 'Ratnagiri (Ranpar / Finolex)' }
    ];

    try {
      let count = 0;
      for (const item of list) {
        // Check if existing record
        const { data: existing } = await this.supabase
          .from('pin_code_availability')
          .select('pca_id')
          .eq('pca_pin_code', item.pin)
          .maybeSingle();

        const res = await this.savePinCode({
          pca_id: existing?.pca_id,
          pca_pin_code: item.pin,
          pca_delivery_charges: 30,
          pca_delivery_charges_above_1kg: 20,
          pca_is_available: true,
          pca_state: 'Maharashtra',
          pca_district: item.name,
          courier_service: 'Local Express Delivery'
        });

        if (res.data) count++;
      }

      return { count };
    } catch (err: any) {
      return { count: 0, error: err?.message || 'Error configuring Ratnagiri Taluka PIN codes' };
    }
  }
}
