import { ItemCategory } from '@/types';

export type CategoryInfo = {
  id: ItemCategory;
  name: string;
  icon: string;
};

const categories: CategoryInfo[] = [
  {
    id: 'tools',
    name: 'Tools',
    icon: '🔨',
  },
  {
    id: 'appliances',
    name: 'Appliances',
    icon: '🔌',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
  },
  {
    id: 'baby',
    name: 'Baby Gear',
    icon: '👶',
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: '🪑',
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '🏀',
  },
  {
    id: 'garden',
    name: 'Garden',
    icon: '🌱',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: '🍳',
  },
  {
    id: 'books',
    name: 'Books',
    icon: '📚',
  },
  {
    id: 'other',
    name: 'Other',
    icon: '📦',
  },
];

export default categories;