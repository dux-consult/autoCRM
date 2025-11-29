export type ViewState = 'dashboard' | 'customers' | 'products' | 'transactions' | 'tasks' | 'automation' | 'superadmin' | 'settings';

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

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  date_of_birth?: string;
  gender?: string;
  interests?: string[];
  rfm_score?: {
    r: number;
    f: number;
    m: number;
    score: string;
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
