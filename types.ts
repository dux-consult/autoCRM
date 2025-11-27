export type ViewState = 'dashboard' | 'customers' | 'tasks' | 'superadmin' | 'settings';

export enum RFMSegment {
  CHAMPION = 'Champion',
  LOYAL = 'Loyal',
  AT_RISK = 'At Risk',
  LOST = 'Lost',
  NEW = 'New'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: RFMSegment;
  lastPurchaseDate: string;
  totalSpent: number;
  recencyScore: number;
  frequencyScore: number;
  monetaryScore: number;
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
