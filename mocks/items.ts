import { Item } from '@/types';

const items: Item[] = [
  {
    id: '1',
    title: 'Power Drill - Cordless',
    description: 'Professional-grade cordless drill with two batteries and charger. Perfect for home projects.',
    images: [
      'https://images.unsplash.com/photo-1616321507403-9e5d7b6b0bd3?q=80&w=1000',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000'
    ],
    category: 'tools',
    condition: 'good',
    rentalType: 'rent',
    price: 5, // $5 per day
    deposit: 50,
    owner: {
      id: '101',
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200',
      rating: 4.8,
    },
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      neighborhood: 'Mission District',
    },
    availableDates: [
      {
        start: '2023-11-01',
        end: '2023-12-31',
      }
    ],
    rating: 4.7,
    reviewCount: 12,
    createdAt: '2023-10-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Stand Mixer - KitchenAid',
    description: 'Red KitchenAid stand mixer, barely used. Great for baking projects!',
    images: [
      'https://images.unsplash.com/photo-1594046243098-0fceea9d451e?q=80&w=1000',
    ],
    category: 'kitchen',
    condition: 'like_new',
    rentalType: 'rent',
    price: 8,
    deposit: 100,
    owner: {
      id: '102',
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      rating: 4.9,
    },
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      neighborhood: 'Noe Valley',
    },
    availableDates: [
      {
        start: '2023-11-01',
        end: '2023-11-30',
      }
    ],
    rating: 5.0,
    reviewCount: 8,
    createdAt: '2023-10-10T09:15:00Z',
  },
  {
    id: '3',
    title: 'Camping Tent - 4 Person',
    description: 'Spacious 4-person tent, waterproof and easy to set up. Perfect for weekend getaways.',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1000'
    ],
    category: 'sports',
    condition: 'good',
    rentalType: 'rent',
    price: 10,
    deposit: 75,
    owner: {
      id: '103',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      rating: 4.6,
    },
    location: {
      latitude: 37.7694,
      longitude: -122.4862,
      neighborhood: 'Sunset District',
    },
    availableDates: [
      {
        start: '2023-11-01',
        end: '2023-12-15',
      }
    ],
    rating: 4.5,
    reviewCount: 6,
    createdAt: '2023-10-05T16:45:00Z',
  },
  {
    id: '4',
    title: 'Projector - HD Quality',
    description: 'HD projector with HDMI and USB connections. Great for movie nights or presentations.',
    images: [
      'https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=1000',
    ],
    category: 'electronics',
    condition: 'good',
    rentalType: 'rent',
    price: 15,
    deposit: 150,
    owner: {
      id: '104',
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
      rating: 4.7,
    },
    location: {
      latitude: 37.7835,
      longitude: -122.4096,
      neighborhood: 'SoMa',
    },
    availableDates: [
      {
        start: '2023-11-01',
        end: '2023-12-31',
      }
    ],
    rating: 4.8,
    reviewCount: 15,
    createdAt: '2023-09-28T11:20:00Z',
  },
  {
    id: '5',
    title: 'Baby Stroller - Lightweight',
    description: 'Compact, lightweight stroller. Easy to fold and carry. Clean and well-maintained.',
    images: [
      'https://images.unsplash.com/photo-1591147834132-a7c242e9c5b1?q=80&w=1000',
    ],
    category: 'baby',
    condition: 'good',
    rentalType: 'loan',
    price: 0,
    owner: {
      id: '105',
      name: 'James Taylor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      rating: 4.9,
    },
    location: {
      latitude: 37.7751,
      longitude: -122.4193,
      neighborhood: 'Hayes Valley',
    },
    availableDates: [
      {
        start: '2023-11-01',
        end: '2023-11-30',
      }
    ],
    rating: 4.9,
    reviewCount: 7,
    createdAt: '2023-10-12T13:10:00Z',
  },
  {
    id: '6',
    title: 'Lawn Mower - Electric',
    description: 'Environmentally friendly electric lawn mower. Quiet and efficient for small to medium yards.',
    images: [
      'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?q=80&w=1000',
    ],
    category: 'garden',
    condition: 'good',
    rentalType: 'rent',
    price: 12,
    deposit: 100,
    owner: {
      id: '106',
      name: 'Emma Brown',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
      rating: 4.5,
    },
    location: {
      latitude: 37.7599,
      longitude: -122.4148,
      neighborhood: 'Potrero Hill',
    },
    availableDates: [
      {
        start: '2023-11-01',
        end: '2023-12-15',
      }
    ],
    rating: 4.6,
    reviewCount: 9,
    createdAt: '2023-09-20T10:30:00Z',
  },
];

export default items;