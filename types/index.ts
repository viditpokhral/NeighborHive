export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    neighborhood?: string;
  };
  rating: number;
  reviewCount: number;
  verified: boolean;
  createdAt: string;
};

export type ItemCategory = 
  | 'tools' 
  | 'appliances' 
  | 'electronics' 
  | 'baby' 
  | 'furniture' 
  | 'sports' 
  | 'garden' 
  | 'kitchen' 
  | 'books' 
  | 'other';

export type RentalType = 'loan' | 'rent' | 'swap';

export type Item = {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: ItemCategory;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'worn';
  rentalType: RentalType;
  price: number; // Per day, 0 for free loans
  deposit?: number;
  owner: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  location: {
    latitude: number;
    longitude: number;
    neighborhood: string;
  };
  availableDates: {
    start: string;
    end: string;
  }[];
  rating: number;
  reviewCount: number;
  createdAt: string;
};

export type Booking = {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  ownerId: string;
  ownerName: string;
  borrowerId: string;
  borrowerName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  deposit?: number;
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  read: boolean;
  createdAt: string;
};

export type Conversation = {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: {
    text: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  itemId?: string;
  itemTitle?: string;
};

export type Review = {
  id: string;
  itemId?: string;
  userId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
};