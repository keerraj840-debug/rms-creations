export interface PurchaseOrder {
  purchase_order_id: number;
  purchase_order_no: string;
  purchase_order_date?: string;
  purchase_order_status?: string; // 'pending' | 'confirmed' | 'accepted' | 'shipped' | 'delivered' | 'cancelled'
  payment_mode?: string | null;
  customer_id?: number | null;
  contact_no?: string | null;
  shipping_type?: string | null;
  shipping_address?: string | null;
  shipping_state?: string | null;
  shipping_country?: string | null;
  shipping_pin_code?: string | null;
  item_taxable_amount?: number;
  item_tax_amount?: number;
  delivery_amount?: number;
  delivery_tax_amount?: number;
  total_amount?: number;
  rounding_amount?: number;
  payable_amount: number;
  transaction_no?: string | null;
  transaction_status?: string | null;
  utr_no?: string | null;
  order_acceptance_date?: string | null;
  order_accepted_by?: number | null;
  order_shipping_date?: string | null;
  order_shipped_by?: number | null;
  order_delivery_date?: string | null;
  order_delivered_by?: number | null;
  cancellation_remark?: string | null;
  shipping_remark?: string | null;
  hon_points?: number;
  refund_remark?: string | null;
  delivery_remark?: string | null;
  is_active?: boolean;
  creation_date?: string;
  created_by?: number | null;
  updation_date?: string;
  updated_by?: number | null;
  details?: PurchaseOrderDetail[];
}

export interface PurchaseOrderDetail {
  purchase_order_details_id?: number;
  purchase_order_id: number;
  item_id?: number | null;
  item_sale_price: number;
  item_quantity: number;
  item_tax_rate?: number;
  item_tax?: number;
  item_taxable?: number;
  item_total?: number;
  item_rating?: number | null;
  item_rating_description?: string | null;
  is_active?: boolean;
  creation_date?: string;
  created_by?: number | null;
  updation_date?: string;
  updated_by?: number | null;
  item_name?: string;
}
