import { Member } from './member';

export interface Share {
  amount: number;
  member: Member;
  status: 'idle' | 'paying' | 'paid' | 'failed';
}
