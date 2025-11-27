import { Customer, RFMSegment, Task, Tenant } from './types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Somchai Jaidee',
    email: 'somchai@example.com',
    phone: '081-234-5678',
    segment: RFMSegment.CHAMPION,
    lastPurchaseDate: '2023-10-25',
    totalSpent: 150000,
    recencyScore: 5,
    frequencyScore: 5,
    monetaryScore: 5
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '089-999-8888',
    segment: RFMSegment.AT_RISK,
    lastPurchaseDate: '2023-08-10',
    totalSpent: 45000,
    recencyScore: 2,
    frequencyScore: 3,
    monetaryScore: 4
  },
  {
    id: '3',
    name: 'Piti Sombat',
    email: 'piti@example.com',
    phone: '086-555-4444',
    segment: RFMSegment.NEW,
    lastPurchaseDate: '2023-10-27',
    totalSpent: 1200,
    recencyScore: 5,
    frequencyScore: 1,
    monetaryScore: 1
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: '101',
    title: 'Follow up on subscription renewal',
    type: 'Call',
    status: 'Pending',
    dueDate: '2023-10-30',
    customerName: 'Jane Doe',
    customerId: '2'
  },
  {
    id: '102',
    title: 'Send promotion LINE message',
    type: 'LINE',
    status: 'Pending',
    dueDate: '2023-10-29',
    customerName: 'Somchai Jaidee',
    customerId: '1'
  },
  {
    id: '103',
    title: 'Check product usage satisfaction',
    type: 'SMS',
    status: 'Overdue',
    dueDate: '2023-10-25',
    customerName: 'Piti Sombat',
    customerId: '3'
  }
];

export const MOCK_TENANTS: Tenant[] = [
  { id: 't1', name: 'Siam Coffee Co.', status: 'Active', userCount: 5, customerCount: 1200 },
  { id: 't2', name: 'Bangkok Spa', status: 'Trial', userCount: 2, customerCount: 340 },
  { id: 't3', name: 'Tech Solutions Ltd.', status: 'Suspended', userCount: 10, customerCount: 5000 },
];
