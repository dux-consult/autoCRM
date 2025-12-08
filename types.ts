export type ViewState = 'dashboard' | 'customers' | 'customer360' | 'products' | 'transactions' | 'tasks' | 'automation' | 'superadmin' | 'settings';

export enum RFMSegment {
  CHAMPION = 'Champion',
  LOYAL = 'Loyal',
  AT_RISK = 'At Risk',
  LOST = 'Lost',
  NEW = 'New'
}

export interface AutomationJourney {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface JourneyVersion {
  id: string;
  journey_id: string;
  version_number: number;
  definition: any; // JSON of nodes and edges
  is_active: boolean;
  created_at: string;
}

export interface CustomerAddress {
  line1?: string;
  city?: string;
  zip?: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  nickname?: string;
  phone: string;
  email: string;
  date_of_birth?: string;
  gender?: string;
  interests?: string[];
  avatar_url?: string;
  line_user_id?: string;
  tier?: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  address?: CustomerAddress;
  referral_id?: string;
  referral?: Customer;
  tags?: string[];
  tax_id?: string;
  rfm_score?: {
    r: number;
    f: number;
    m: number;
    score: string;
    segment?: string;
  };
  clv?: number;
  segmentation_status?: string;
  last_purchase_date?: string;
  total_transactions: number;
  total_spend: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'Call' | 'SMS' | 'LINE';
  status: 'Pending' | 'Completed' | 'Overdue';
  dueDate: string;
  customerName: string;
  customerId: string;
}

export interface Tenant {
  id: string;
  name: string;
  status: 'Active' | 'Trial' | 'Suspended';
  userCount: number;
  customerCount: number;
}

export interface Shop {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  selling_price: number;
  cost_price?: number;
  unit?: string;
  usage_duration_days?: number;
  created_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Transaction {
  id: string;
  customer_id: string;
  customer?: Customer;
  total_amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  payment_method?: string;
  transaction_date: string;
  items?: TransactionItem[];
  created_at: string;
}

// Customer 360 Types
export interface CustomerNote {
  id: string;
  customer_id: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerProduct {
  id: string;
  customer_id: string;
  product_id: string;
  product?: Product;
  transaction_id?: string;
  transaction_item_id?: string;
  quantity: number;
  installation_date?: string;
  warranty_end_date?: string;
  next_service_date?: string;
  status: 'active' | 'expired' | 'serviced';
  created_at: string;
}

export interface ActivityLog {
  id: string;
  customer_id: string;
  type: 'order' | 'chat' | 'call' | 'auto';
  title: string;
  description?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
}
