import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { LocalStorageService } from './local-storage.service';
import { 
  CustomHamperRequest, 
  CustomHamperRequestItem, 
  CustomHamperStatus,
  HamperMarkupConfig
} from '../models/custom-hamper.model';
import { PurchaseOrder } from '../models/purchase-order.model';

@Injectable({
  providedIn: 'root'
})
export class CustomHamperService {
  private readonly supabase = inject(SupabaseService);
  private readonly localStorage = inject(LocalStorageService);

  private readonly STORAGE_KEY = 'rms_custom_hamper_requests_cache';

  /**
   * Generate human-readable consultation reference number (e.g. CHR-202610-4821)
   */
  generateRequestNo(): string {
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `CHR-${datePrefix}-${randomSuffix}`;
  }

  /**
   * Submit a creative custom hamper consultation request
   */
  async submitRequest(
    payload: Omit<CustomHamperRequest, 'id' | 'request_no' | 'status' | 'creation_date' | 'updation_date'>,
    items: Omit<CustomHamperRequestItem, 'id' | 'request_id'>[]
  ): Promise<{ success: boolean; requestNo?: string; request?: CustomHamperRequest; error?: string }> {
    const requestNo = this.generateRequestNo();
    const now = new Date().toISOString();

    // 1. Calculate confirmed catalogue subtotal
    const estimatedCatalogueTotal = items.reduce((sum, item) => {
      if (item.is_confirmed_catalogue && typeof item.unit_price_snapshot === 'number') {
        return sum + (item.unit_price_snapshot * (item.quantity || 1));
      }
      return sum;
    }, 0);

    const requestRecord: CustomHamperRequest = {
      id: Date.now(),
      request_no: requestNo,
      customer_id: payload.customer_id || null,
      customer_name: payload.customer_name.trim(),
      customer_email: payload.customer_email.trim(),
      customer_phone: payload.customer_phone.trim(),
      status: 'New',
      occasion: payload.occasion || 'Personal Celebration',
      theme: payload.theme || 'Bespoke Luxury',
      recipient_gender: payload.recipient_gender || 'Unisex',
      personal_message: payload.personal_message?.trim() || '',
      customer_notes: payload.customer_notes?.trim() || '',
      estimated_catalogue_total: estimatedCatalogueTotal,
      quoted_total: null,
      quoted_delivery_charge: null,
      admin_response: null,
      admin_notes: null,
      is_active: true,
      creation_date: now,
      updation_date: now,
      items: items.map((it, idx) => ({
        ...it,
        id: Date.now() + idx + 1,
        request_id: Date.now(),
        creation_date: now
      }))
    };

    // 2. Try inserting into Supabase tables
    try {
      const { data: supaRequest, error: reqErr } = await this.supabase
        .from('custom_hamper_requests')
        .insert([{
          request_no: requestRecord.request_no,
          customer_id: requestRecord.customer_id,
          customer_name: requestRecord.customer_name,
          customer_email: requestRecord.customer_email,
          customer_phone: requestRecord.customer_phone,
          status: requestRecord.status,
          occasion: requestRecord.occasion,
          theme: requestRecord.theme,
          recipient_gender: requestRecord.recipient_gender,
          personal_message: requestRecord.personal_message,
          customer_notes: requestRecord.customer_notes,
          estimated_catalogue_total: requestRecord.estimated_catalogue_total,
          is_active: true,
          creation_date: now,
          updation_date: now
        }])
        .select()
        .single();

      if (!reqErr && supaRequest) {
        requestRecord.id = supaRequest.id;

        // Insert items into custom_hamper_request_items
        if (items.length > 0) {
          const itemRows = items.map(item => ({
            request_id: supaRequest.id,
            item_type: item.item_type,
            product_id: item.product_id || null,
            inclusion_item_id: item.inclusion_item_id || null,
            item_name: item.item_name,
            item_description: item.item_description || null,
            quantity: item.quantity,
            unit_price_snapshot: item.unit_price_snapshot ?? null,
            admin_confirmed_price: null,
            reference_image_url: item.reference_image_url || null,
            is_confirmed_catalogue: item.is_confirmed_catalogue,
            is_active: true,
            creation_date: now
          }));
          await this.supabase.from('custom_hamper_request_items').insert(itemRows);
        }
      } else {
        console.warn('Note: Storing custom hamper request in local synchronized storage.');
      }
    } catch {
      // Offline fallback handling
    }

    // 3. Persist to local synchronized cache for instant reactivity
    this.saveToLocalCache(requestRecord);

    return {
      success: true,
      requestNo: requestRecord.request_no,
      request: requestRecord
    };
  }

  /**
   * Get all requests for a specific customer
   */
  async getCustomerRequests(customerId?: number | null, email?: string): Promise<CustomHamperRequest[]> {
    const cached = this.getLocalCache();
    let supaList: CustomHamperRequest[] = [];

    try {
      let query = this.supabase.from('custom_hamper_requests').select('*');
      if (customerId) {
        query = query.eq('customer_id', customerId);
      } else if (email) {
        query = query.eq('customer_email', email);
      }
      const { data, error } = await query.order('creation_date', { ascending: false });
      if (!error && data) {
        supaList = data;
      }
    } catch {
      // Fallback to cache
    }

    // Merge and de-duplicate by request_no
    const map = new Map<string, CustomHamperRequest>();
    supaList.forEach(r => map.set(r.request_no, r));
    cached.forEach(r => {
      const match = (customerId && r.customer_id === customerId) || (email && r.customer_email?.toLowerCase() === email.toLowerCase());
      if (match) {
        map.set(r.request_no, { ...map.get(r.request_no), ...r });
      }
    });

    return Array.from(map.values()).sort((a, b) => 
      new Date(b.creation_date || 0).getTime() - new Date(a.creation_date || 0).getTime()
    );
  }

  /**
   * Get all requests for Admin Review Dashboard
   */
  async getAllRequests(statusFilter?: string): Promise<CustomHamperRequest[]> {
    const cached = this.getLocalCache();
    let supaList: CustomHamperRequest[] = [];

    try {
      let query = this.supabase.from('custom_hamper_requests').select('*');
      if (statusFilter && statusFilter !== 'All') {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query.order('creation_date', { ascending: false });
      if (!error && data) {
        supaList = data;
      }
    } catch {
      // Fallback
    }

    const map = new Map<string, CustomHamperRequest>();
    supaList.forEach(r => map.set(r.request_no, r));
    cached.forEach(r => {
      if (!statusFilter || statusFilter === 'All' || r.status === statusFilter) {
        map.set(r.request_no, { ...map.get(r.request_no), ...r });
      }
    });

    return Array.from(map.values()).sort((a, b) => 
      new Date(b.creation_date || 0).getTime() - new Date(a.creation_date || 0).getTime()
    );
  }

  /**
   * Get detailed request with all item mappings
   */
  async getRequestDetails(requestNoOrId: string | number): Promise<CustomHamperRequest | null> {
    const cached = this.getLocalCache();
    const localMatch = cached.find(r => r.request_no === String(requestNoOrId) || r.id === Number(requestNoOrId));

    try {
      let query = this.supabase.from('custom_hamper_requests').select('*');
      if (typeof requestNoOrId === 'number' || !isNaN(Number(requestNoOrId))) {
        query = query.eq('id', Number(requestNoOrId));
      } else {
        query = query.eq('request_no', String(requestNoOrId));
      }
      const { data, error } = await query.single();
      if (!error && data) {
        // Fetch items
        const { data: itemData } = await this.supabase
          .from('custom_hamper_request_items')
          .select('*')
          .eq('request_id', data.id);
        
        return {
          ...data,
          items: itemData || localMatch?.items || []
        };
      }
    } catch {
      // Fallback
    }

    return localMatch || null;
  }

  /**
   * Admin prepares and saves a personalized consultation quotation
   */
  async updateAdminQuotation(
    requestNo: string,
    updates: {
      quoted_total: number;
      quoted_delivery_charge: number;
      admin_response: string;
      admin_notes?: string;
      status: CustomHamperStatus;
      itemPriceUpdates?: { itemName: string; confirmedPrice: number }[];
    }
  ): Promise<{ success: boolean; error?: string }> {
    const now = new Date().toISOString();

    // 1. Update in local cache
    const cached = this.getLocalCache();
    const target = cached.find(r => r.request_no === requestNo);
    if (target) {
      target.quoted_total = updates.quoted_total;
      target.quoted_delivery_charge = updates.quoted_delivery_charge;
      target.admin_response = updates.admin_response;
      if (updates.admin_notes !== undefined) target.admin_notes = updates.admin_notes;
      target.status = updates.status;
      target.reviewed_at = now;
      target.updation_date = now;

      if (updates.itemPriceUpdates && target.items) {
        target.items.forEach(item => {
          const match = updates.itemPriceUpdates?.find(p => p.itemName === item.item_name);
          if (match) {
            item.admin_confirmed_price = match.confirmedPrice;
          }
        });
      }
      this.localStorage.setItem(this.STORAGE_KEY, cached);
    }

    // 2. Update in Supabase
    try {
      await this.supabase
        .from('custom_hamper_requests')
        .update({
          quoted_total: updates.quoted_total,
          quoted_delivery_charge: updates.quoted_delivery_charge,
          admin_response: updates.admin_response,
          admin_notes: updates.admin_notes || null,
          status: updates.status,
          reviewed_at: now,
          updation_date: now
        })
        .eq('request_no', requestNo);
    } catch {
      // Local sync is already updated
    }

    return { success: true };
  }

  /**
   * Customer accepts quotation and creates exactly ONE confirmed order
   */
  async acceptQuotationAndCreateOrder(
    requestNo: string,
    shippingInfo: {
      address: string;
      city: string;
      state: string;
      pinCode: string;
      phone: string;
      paymentMode: 'COD' | 'ONLINE_UPI';
      utrNo?: string;
    }
  ): Promise<{ success: boolean; orderNo?: string; error?: string }> {
    const details = await this.getRequestDetails(requestNo);
    if (!details) {
      return { success: false, error: 'Custom hamper request could not be found.' };
    }

    if (details.status === 'Accepted' || details.converted_order_no) {
      return { 
        success: false, 
        error: `This proposal has already been accepted and converted into order ${details.converted_order_no}.` 
      };
    }

    if (details.status !== 'Quotation Prepared') {
      return { 
        success: false, 
        error: 'Only proposals with an active quotation can be accepted.' 
      };
    }

    // Compute final payable amount: quoted_total + quoted_delivery_charge
    const itemsTotal = Number(details.quoted_total || details.estimated_catalogue_total || 0);
    const deliveryCharge = Number(details.quoted_delivery_charge || 0);
    const finalTotal = itemsTotal + deliveryCharge;

    const orderNo = `RMS-CH-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullAddress = `${shippingInfo.address.trim()}, ${shippingInfo.city.trim()}, ${shippingInfo.state.trim()}`;
    const now = new Date().toISOString();

    const orderRecord: Partial<PurchaseOrder> = {
      purchase_order_no: orderNo,
      purchase_order_date: now,
      purchase_order_status: shippingInfo.paymentMode === 'COD' ? 'confirmed' : 'pending',
      payable_amount: finalTotal,
      total_amount: finalTotal,
      delivery_amount: deliveryCharge,
      contact_no: shippingInfo.phone.trim(),
      payment_mode: shippingInfo.paymentMode === 'COD' ? 'Cash on Delivery (COD)' : 'UPI Online (7350120467)',
      shipping_type: 'Handcrafted Bespoke Delivery',
      shipping_address: fullAddress,
      shipping_state: shippingInfo.state.trim(),
      shipping_country: 'India',
      shipping_pin_code: shippingInfo.pinCode.trim(),
      transaction_status: shippingInfo.paymentMode === 'COD' ? 'Pending COD' : (shippingInfo.utrNo ? 'UTR Submitted' : 'Pending Verification'),
      utr_no: shippingInfo.utrNo?.trim() || null,
      shipping_remark: `Bespoke Custom Hamper (${details.request_no}) | Theme: ${details.theme || 'Custom'} | Occasion: ${details.occasion || 'Special'}`,
      is_active: true,
      creation_date: now
    };

    let createdPurchaseOrderId: number | null = null;

    // 1. Insert confirmed purchase order
    try {
      const { data: poData, error: poErr } = await this.supabase
        .from('purchase_order')
        .insert([orderRecord])
        .select()
        .single();
      
      if (!poErr && poData) {
        createdPurchaseOrderId = poData.purchase_order_id;

        // Insert details for each item
        if (details.items && details.items.length > 0) {
          const detailRows = details.items.map(it => ({
            purchase_order_id: createdPurchaseOrderId,
            item_id: it.product_id || null,
            item_sale_price: Number(it.admin_confirmed_price || it.unit_price_snapshot || 0),
            item_quantity: it.quantity,
            item_total: Number(it.admin_confirmed_price || it.unit_price_snapshot || 0) * it.quantity,
            is_active: true,
            creation_date: now
          }));
          await this.supabase.from('purchase_order_details').insert(detailRows);
        }
      }
    } catch {
      // Fallback
    }

    // 2. Mark CustomHamperRequest as Accepted & link order number
    details.status = 'Accepted';
    details.accepted_at = now;
    details.converted_order_no = orderNo;
    details.converted_purchase_order_id = createdPurchaseOrderId;
    details.updation_date = now;

    this.saveToLocalCache(details);

    try {
      await this.supabase
        .from('custom_hamper_requests')
        .update({
          status: 'Accepted',
          accepted_at: now,
          converted_purchase_order_id: createdPurchaseOrderId,
          updation_date: now
        })
        .eq('request_no', requestNo);
    } catch {
      // Handled
    }

    return {
      success: true,
      orderNo: orderNo
    };
  }

  /**
   * Customer declines proposal
   */
  async declineQuotation(requestNo: string, reason?: string): Promise<{ success: boolean }> {
    const now = new Date().toISOString();
    const cached = this.getLocalCache();
    const target = cached.find(r => r.request_no === requestNo);
    if (target) {
      target.status = 'Declined';
      target.declined_at = now;
      if (reason) {
        target.customer_notes = `${target.customer_notes ? target.customer_notes + '\n\n' : ''}[Customer Declined: ${reason}]`;
      }
      target.updation_date = now;
      this.localStorage.setItem(this.STORAGE_KEY, cached);
    }

    try {
      await this.supabase
        .from('custom_hamper_requests')
        .update({
          status: 'Declined',
          declined_at: now,
          updation_date: now
        })
        .eq('request_no', requestNo);
    } catch {
      // Handled
    }

    return { success: true };
  }

  // --- Local synchronized storage helpers ---
  private getLocalCache(): CustomHamperRequest[] {
    return this.localStorage.getItem<CustomHamperRequest[]>(this.STORAGE_KEY) || [];
  }

  private saveToLocalCache(record: CustomHamperRequest) {
    const list = this.getLocalCache();
    const idx = list.findIndex(r => r.request_no === record.request_no);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...record };
    } else {
      list.unshift(record);
    }
    this.localStorage.setItem(this.STORAGE_KEY, list);
  }

  /**
   * Parse hamper item markup config (% and fixed amount) from app_settings support_no text column
   */
  parseHamperMarkupConfig(supportNo: string | null | undefined): HamperMarkupConfig {
    const defaultConfig: HamperMarkupConfig = { percent: 0, fixedAmount: 0 };
    if (!supportNo) return defaultConfig;
    try {
      const parsed = JSON.parse(supportNo);
      if (parsed && typeof parsed === 'object') {
        const percent = typeof parsed['hamper_markup_percent'] === 'number'
          ? Math.max(0, parsed['hamper_markup_percent'])
          : 0;

        let fixed = 0;
        if (typeof parsed['hamper_markup_fixed'] === 'number') {
          fixed = Math.max(0, parsed['hamper_markup_fixed']);
        } else if (typeof parsed['hamper_item_markup'] === 'number') {
          fixed = Math.max(0, parsed['hamper_item_markup']);
        }

        return { percent, fixedAmount: fixed };
      }
    } catch { }

    const num = Number(supportNo);
    if (!isNaN(num) && num >= 0) {
      return { percent: 0, fixedAmount: num };
    }
    return defaultConfig;
  }

  /**
   * Calculate customer display price for an item:
   * Base Price + (Base Price * percent / 100) + fixedAmount
   */
  calculateCustomerItemPrice(basePrice: number | null | undefined, config: HamperMarkupConfig): number {
    const base = Math.max(0, Number(basePrice) || 0);
    const percentExtra = Math.round((base * (config.percent || 0)) / 100);
    const fixedExtra = Math.max(0, Number(config.fixedAmount) || 0);
    return base + percentExtra + fixedExtra;
  }

  /**
   * Parse fixed hamper item markup (for backward compatibility)
   */
  parseHamperItemMarkup(supportNo: string | null | undefined): number {
    return this.parseHamperMarkupConfig(supportNo).fixedAmount;
  }

  /**
   * Get active admin-configured markup config (% and fixed ₹)
   */
  async getHamperMarkupConfig(): Promise<HamperMarkupConfig> {
    try {
      const { data, error } = await this.supabase
        .from('app_settings')
        .select('support_no')
        .limit(1)
        .single();
      if (!error && data) {
        return this.parseHamperMarkupConfig(data.support_no);
      }
    } catch { }
    return { percent: 0, fixedAmount: 0 };
  }

  /**
   * Get active admin-configured fixed markup amount (backward compatibility)
   */
  async getHamperItemMarkup(): Promise<number> {
    const config = await this.getHamperMarkupConfig();
    return config.fixedAmount;
  }

  /**
   * Update admin-configured markup config (percentage % + fixed ₹) in app_settings support_no
   */
  async updateHamperMarkupConfig(config: HamperMarkupConfig): Promise<{ success: boolean; error?: string }> {
    try {
      const cleanPercent = Math.max(0, Number(config.percent) || 0);
      const cleanFixed = Math.max(0, Number(config.fixedAmount) || 0);

      const { data: current } = await this.supabase
        .from('app_settings')
        .select('*')
        .limit(1)
        .single();

      let existingObj: Record<string, any> = {};
      if (current?.support_no) {
        try {
          existingObj = JSON.parse(current.support_no);
          if (typeof existingObj !== 'object' || existingObj === null) {
            existingObj = {};
          }
        } catch {
          existingObj = {};
        }
      }

      existingObj['hamper_markup_percent'] = cleanPercent;
      existingObj['hamper_markup_fixed'] = cleanFixed;
      existingObj['hamper_item_markup'] = cleanFixed; // backward compatibility
      const payloadString = JSON.stringify(existingObj);

      if (current?.id) {
        const { error } = await this.supabase
          .from('app_settings')
          .update({ support_no: payloadString })
          .eq('id', current.id);
        if (error) return { success: false, error: error.message };
      } else {
        const { error } = await this.supabase
          .from('app_settings')
          .insert([{ support_no: payloadString, is_active: true }]);
        if (error) return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update markup config' };
    }
  }

  /**
   * Update fixed markup (for backward compatibility)
   */
  async updateHamperItemMarkup(markup: number): Promise<{ success: boolean; error?: string }> {
    const existing = await this.getHamperMarkupConfig();
    return this.updateHamperMarkupConfig({
      percent: existing.percent,
      fixedAmount: Math.max(0, Number(markup) || 0)
    });
  }
}
