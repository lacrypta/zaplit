export type MemberStatus = 'pending' | 'paid' | 'failed';

export type Member = {
  id: string;
  name: string;
  avatarUrl: string;
  amount: number;
  nwcCredentials?: string;
  status: MemberStatus;
};
