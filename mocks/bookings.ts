import { Booking } from '@/types';

const bookings: Booking[] = [
  {
    id: '1001',
    itemId: '1',
    itemTitle: 'Power Drill - Cordless',
    itemImage: 'https://images.unsplash.com/photo-1616321507403-9e5d7b6b0bd3?q=80&w=1000',
    ownerId: '101',
    ownerName: 'Alex Johnson',
    borrowerId: '102',
    borrowerName: 'Maria Garcia',
    startDate: '2023-11-10',
    endDate: '2023-11-12',
    status: 'approved',
    totalPrice: 15, // 3 days * $5
    deposit: 50,
    createdAt: '2023-11-05T14:30:00Z',
  },
  {
    id: '1002',
    itemId: '3',
    itemTitle: 'Camping Tent - 4 Person',
    itemImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000',
    ownerId: '103',
    ownerName: 'David Kim',
    borrowerId: '101',
    borrowerName: 'Alex Johnson',
    startDate: '2023-11-15',
    endDate: '2023-11-17',
    status: 'pending',
    totalPrice: 30, // 3 days * $10
    deposit: 75,
    createdAt: '2023-11-08T09:15:00Z',
  },
  {
    id: '1003',
    itemId: '2',
    itemTitle: 'Stand Mixer - KitchenAid',
    itemImage: 'https://images.unsplash.com/photo-1594046243098-0fceea9d451e?q=80&w=1000',
    ownerId: '102',
    ownerName: 'Maria Garcia',
    borrowerId: '104',
    borrowerName: 'Sarah Wilson',
    startDate: '2023-11-20',
    endDate: '2023-11-22',
    status: 'completed',
    totalPrice: 24, // 3 days * $8
    deposit: 100,
    createdAt: '2023-11-01T16:45:00Z',
  },
  {
    id: '1004',
    itemId: '5',
    itemTitle: 'Baby Stroller - Lightweight',
    itemImage: 'https://images.unsplash.com/photo-1591147834132-a7c242e9c5b1?q=80&w=1000',
    ownerId: '105',
    ownerName: 'James Taylor',
    borrowerId: '102',
    borrowerName: 'Maria Garcia',
    startDate: '2023-11-05',
    endDate: '2023-11-08',
    status: 'active',
    totalPrice: 0, // Free loan
    deposit: 0,
    createdAt: '2023-11-01T11:20:00Z',
  },
];

export default bookings;