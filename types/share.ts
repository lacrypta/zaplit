import { Currency } from './currency';
import { Member } from './member';

export interface Share {
  amount: number;
  currency: Currency;
  amountSats: number;
  member: Member;
  status: 'idle' | 'paying' | 'paid' | 'failed';
}
