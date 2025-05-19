import { Conversation } from '@/types';

const conversations: Conversation[] = [
  {
    id: '2001',
    participants: [
      {
        id: '101',
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200',
      },
      {
        id: '102',
        name: 'Maria Garcia',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      }
    ],
    lastMessage: {
      text: "Great! I'll pick up the drill tomorrow at 3pm.",
      createdAt: '2023-11-08T14:30:00Z',
      senderId: '102',
    },
    unreadCount: 0,
    itemId: '1',
    itemTitle: 'Power Drill - Cordless',
  },
  {
    id: '2002',
    participants: [
      {
        id: '103',
        name: 'David Kim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      },
      {
        id: '101',
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200',
      }
    ],
    lastMessage: {
      text: "Is the tent still available for next weekend?",
      createdAt: '2023-11-07T09:15:00Z',
      senderId: '101',
    },
    unreadCount: 1,
    itemId: '3',
    itemTitle: 'Camping Tent - 4 Person',
  },
  {
    id: '2003',
    participants: [
      {
        id: '102',
        name: 'Maria Garcia',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      },
      {
        id: '104',
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
      }
    ],
    lastMessage: {
      text: "Thanks for returning the mixer in such great condition!",
      createdAt: '2023-11-23T16:45:00Z',
      senderId: '102',
    },
    unreadCount: 0,
    itemId: '2',
    itemTitle: 'Stand Mixer - KitchenAid',
  },
  {
    id: '2004',
    participants: [
      {
        id: '105',
        name: 'James Taylor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
      },
      {
        id: '102',
        name: 'Maria Garcia',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      }
    ],
    lastMessage: {
      text: "How's the stroller working out for you?",
      createdAt: '2023-11-06T11:20:00Z',
      senderId: '105',
    },
    unreadCount: 2,
    itemId: '5',
    itemTitle: 'Baby Stroller - Lightweight',
  },
];

export default conversations;