import { Currency } from './currency';
import { Member } from './member';
import { Share } from './share';
import { Team } from './team';

export type BillStatus = 'idle' | 'pending' | 'settled' | 'failed';

export interface Bill {
  id: string;
  title: string;
  amount: number;
  amountSats: number;
  currency: Currency;
  description?: string;
  date: Date;
  paidBy: Member;
  members: Member[];
  shares: Share[];
  team: Team;
  status: BillStatus;
}
