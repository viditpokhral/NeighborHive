import { User } from './index';

// Base data interfaces
export interface BorrowerData {
  savedItems: string[];
  borrowingHistory: string[];
}

export interface LenderData {
  listedItems: string[];
  lendingHistory: string[];
  earnings: number;
}

// Functional interfaces
export interface Borrower extends BorrowerData {
  saveItem: (itemId: string) => Promise<boolean>;
  unsaveItem: (itemId: string) => Promise<boolean>;
  addToBorrowingHistory: (bookingId: string) => void;
}

export interface Lender extends LenderData {
  addListedItem: (itemId: string) => void;
  removeListedItem: (itemId: string) => void;
  addToLendingHistory: (bookingId: string) => void;
  addEarnings: (amount: number) => void;
}

// Combined user profile
export interface UserProfile extends User {
  borrower?: BorrowerData;
  lender?: LenderData;
}