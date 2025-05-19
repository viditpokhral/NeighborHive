import { Message } from '@/types';

const messages: Message[] = [
  // Conversation 1 - Alex and Maria about the drill
  {
    id: '3001',
    conversationId: '2001',
    senderId: '102', // Maria
    receiverId: '101', // Alex
    text: "Hi Alex, I'm interested in borrowing your power drill this weekend. Is it still available?",
    read: true,
    createdAt: '2023-11-07T10:30:00Z',
  },
  {
    id: '3002',
    conversationId: '2001',
    senderId: '101', // Alex
    receiverId: '102', // Maria
    text: "Hi Maria! Yes, the drill is available. When would you like to pick it up?",
    read: true,
    createdAt: '2023-11-07T11:15:00Z',
  },
  {
    id: '3003',
    conversationId: '2001',
    senderId: '102', // Maria
    receiverId: '101', // Alex
    text: "Would tomorrow at 3pm work for you?",
    read: true,
    createdAt: '2023-11-07T11:30:00Z',
  },
  {
    id: '3004',
    conversationId: '2001',
    senderId: '101', // Alex
    receiverId: '102', // Maria
    text: "That works for me. I'll send you my address.",
    read: true,
    createdAt: '2023-11-07T11:45:00Z',
  },
  {
    id: '3005',
    conversationId: '2001',
    senderId: '101', // Alex
    receiverId: '102', // Maria
    text: "123 Main St, San Francisco. Call me when you arrive.",
    read: true,
    createdAt: '2023-11-07T11:46:00Z',
  },
  {
    id: '3006',
    conversationId: '2001',
    senderId: '102', // Maria
    receiverId: '101', // Alex
    text: "Great! I'll pick up the drill tomorrow at 3pm.",
    read: true,
    createdAt: '2023-11-08T14:30:00Z',
  },

  // Conversation 2 - David and Alex about the tent
  {
    id: '3007',
    conversationId: '2002',
    senderId: '101', // Alex
    receiverId: '103', // David
    text: "Hi David, I'm planning a camping trip next weekend. Is your tent available for rent?",
    read: true,
    createdAt: '2023-11-07T09:00:00Z',
  },
  {
    id: '3008',
    conversationId: '2002',
    senderId: '101', // Alex
    receiverId: '103', // David
    text: "Is the tent still available for next weekend?",
    read: false,
    createdAt: '2023-11-07T09:15:00Z',
  },
];

export default messages;