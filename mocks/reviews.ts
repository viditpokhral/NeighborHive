import { Review } from '@/types';

const reviews: Review[] = [
  {
    id: '4001',
    itemId: '1', // Power Drill
    userId: '101', // Alex (owner)
    reviewerId: '102', // Maria (borrower)
    reviewerName: 'Maria Garcia',
    reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    rating: 5,
    comment: "The drill worked perfectly for my project. Alex was very helpful with instructions on how to use it properly.",
    createdAt: '2023-11-13T14:30:00Z',
  },
  {
    id: '4002',
    itemId: '2', // Stand Mixer
    userId: '102', // Maria (owner)
    reviewerId: '104', // Sarah (borrower)
    reviewerName: 'Sarah Wilson',
    reviewerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
    rating: 5,
    comment: "The mixer was in perfect condition and made baking so much easier. Thanks Maria!",
    createdAt: '2023-11-23T16:45:00Z',
  },
  {
    id: '4003',
    userId: '102', // Maria (as a borrower)
    reviewerId: '101', // Alex (as an owner)
    reviewerName: 'Alex Johnson',
    reviewerAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200',
    rating: 5,
    comment: "Maria took great care of my drill and returned it on time. Would definitely lend to her again!",
    createdAt: '2023-11-13T15:00:00Z',
  },
  {
    id: '4004',
    userId: '104', // Sarah (as a borrower)
    reviewerId: '102', // Maria (as an owner)
    reviewerName: 'Maria Garcia',
    reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    rating: 5,
    comment: "Sarah was a responsible borrower and took great care of my mixer. Would lend to her anytime!",
    createdAt: '2023-11-23T17:00:00Z',
  },
];

export default reviews;