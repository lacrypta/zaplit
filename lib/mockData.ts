// /lib/mockData.ts

// Definimos y exportamos todos los tipos para que sean accesibles
export type MemberStatus = 'joined' | 'pending' | 'invited';

export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
  status: MemberStatus;
  isOwner?: boolean;
}

export interface Bill {
  id: string;
  amount: number;
  currency: 'SAT' | 'USD' | 'BRL';
  date: string;
  time: string;
  totalAmount: number;
  yourShare: number;
  members: BillMember[];
  status: 'pending' | 'completed';
}

export interface BillMember {
  id: string;
  name: string;
  share: number;
  hasPaid: boolean;
  isProcessing?: boolean;
}

// Definimos los miembros con tipos explícitos para evitar inferencia incorrecta
export const mockMembers: { owner: Member; potentialMembers: Member[] } = {
  owner: {
    id: '1',
    name: 'You',
    avatarUrl: '/placeholder.svg?height=40&width=40',
    status: 'joined' as MemberStatus,
    isOwner: true,
  },
  potentialMembers: [
    {
      id: '2',
      name: 'Friend1',
      avatarUrl: '/placeholder.svg?height=40&width=40',
      status: 'joined' as MemberStatus,
    },
    {
      id: '3',
      name: 'Friend2',
      avatarUrl: '/placeholder.svg?height=40&width=40',
      status: 'pending' as MemberStatus,
    },
    {
      id: '4',
      name: 'Friend3',
      avatarUrl: '/placeholder.svg?height=40&width=40',
      status: 'joined' as MemberStatus,
    },
  ],
};

// Función helper para crear nuevos bills
export const createNewBill = (amount: number, currency: 'SAT' | 'USD' | 'BRL', teamMembers: Member[]): Bill => {
  const share = Math.floor(amount / teamMembers.length);

  return {
    id: Math.random().toString(36).substr(2, 9),
    amount,
    currency,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    totalAmount: amount,
    yourShare: share,
    status: 'pending',
    members: teamMembers.map((member) => ({
      id: member.id,
      name: member.name,
      share,
      hasPaid: false,
      isProcessing: false,
    })),
  };
};

// Bills de ejemplo con tipos explícitos
export const mockBills: Bill[] = [
  {
    id: '1',
    amount: 4000,
    currency: 'SAT',
    date: '2025-02-21',
    time: '14:30',
    totalAmount: 4000,
    yourShare: 1000,
    status: 'pending',
    members: [
      { id: '1', name: 'You', share: 1000, hasPaid: true },
      { id: '2', name: 'Friend1', share: 1000, hasPaid: false },
      { id: '3', name: 'Friend2', share: 1000, hasPaid: false },
      { id: '4', name: 'Friend3', share: 1000, hasPaid: false },
    ],
  },
  {
    id: '2',
    amount: 6000,
    currency: 'SAT',
    date: '2025-02-20',
    time: '19:45',
    totalAmount: 6000,
    yourShare: 1500,
    status: 'pending',
    members: [
      { id: '1', name: 'You', share: 1500, hasPaid: true },
      { id: '2', name: 'Friend1', share: 1500, hasPaid: true },
      { id: '3', name: 'Friend2', share: 1500, hasPaid: false },
      { id: '4', name: 'Friend3', share: 1500, hasPaid: false },
    ],
  },
];

// Funciones de persistencia con manejo de tipos
export const getStoredBills = (): Bill[] => {
  if (typeof window === 'undefined') return [];
  const storedBills = localStorage.getItem('bills');
  return storedBills ? JSON.parse(storedBills) : mockBills;
};

export const storeBills = (bills: Bill[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('bills', JSON.stringify(bills));
};
