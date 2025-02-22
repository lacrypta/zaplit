import { Member } from './member';
import { Share } from './share';
import { Team } from './team';

export interface Bill {
  id: string;
  title: string;
  amount: number;
  description?: string;
  date: Date;
  paidBy: Member;
  members: Member[];
  shares: Share[];
  team: Team;
  status: 'pending' | 'settled';
}
