export type CustomHamperStatus = 
  | 'New' 
  | 'Under Review' 
  | 'Awaiting Customer' 
  | 'Quotation Prepared' 
  | 'Accepted' 
  | 'Declined' 
  | 'Completed';

export type CustomHamperItemType = 
  | 'catalogue_product' 
  | 'catalogue_inclusion' 
  | 'custom_requested';

export interface CustomHamperRequest {
  id: number;
  request_no: string;
  customer_id?: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: CustomHamperStatus;
  occasion?: string;
  theme?: string;
  recipient_gender?: string;
  personal_message?: string;
  customer_notes?: string;
  estimated_catalogue_total: number;
  quoted_total?: number | null;
  quoted_delivery_charge?: number | null;
  admin_response?: string | null;
  admin_notes?: string | null;
  reviewed_by?: number | null;
  reviewed_at?: string | null;
  accepted_at?: string | null;
  declined_at?: string | null;
  converted_purchase_order_id?: number | null;
  converted_order_no?: string | null;
  is_active?: boolean;
  creation_date?: string;
  updation_date?: string;
  items?: CustomHamperRequestItem[];
}

export interface CustomHamperRequestItem {
  id?: number;
  request_id?: number;
  item_type: CustomHamperItemType;
  product_id?: number | null;
  inclusion_item_id?: number | null;
  item_name: string;
  item_description?: string | null;
  quantity: number;
  unit_price_snapshot?: number | null;
  admin_confirmed_price?: number | null;
  reference_image_url?: string | null;
  is_confirmed_catalogue: boolean;
  is_active?: boolean;
  creation_date?: string;
}

export interface HamperBuilderItem {
  uid: string; // Unique temporary ID for builder session
  itemType: CustomHamperItemType;
  productId?: number;
  inclusionId?: number;
  name: string;
  description?: string;
  price?: number | null; // NULL for custom item
  basePrice?: number | null;
  markupAmount?: number;
  isPriceConfirmed: boolean;
  quantity: number;
  stockQuantity?: number | null;
  imageUrl?: string;
  category?: string;
}

export interface HamperMarkupConfig {
  percent: number;      // percentage markup e.g. 10 (%)
  fixedAmount: number;  // fixed surcharge e.g. 20 (₹)
}
