'use client';

import { nwc } from '@getalby/sdk';
import { Bill } from '@/types/bill';
import { createContext, useContext, useState, ReactNode } from 'react';
import { collectShare } from '@/lib/utils';
interface BillContextType {
  bills: Bill[];
  currentBill: Bill | null;
  isLoading: boolean;
  error: string | null;
  createBill: (bill: Omit<Bill, 'id'>) => Promise<void>;
  updateBill: (billId: string, updates: Partial<Bill>) => Promise<void>;
  getBillsByTeam: (teamId: string) => Promise<void>;
  settleBill: (bill: Bill) => Promise<void>;
  setCurrentBill: (bill: Bill | null) => void;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export function BillProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createBill = async (bill: Omit<Bill, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      const newBill: Bill = {
        id: '1',
        title: 'Test',
        amount: 100,
        date: new Date(),
        paidBy: {
          id: '1',
          name: 'John Doe',
          avatarUrl: 'https://example.com/avatar.png',
          amount: 100,
          status: 'pending',
        },
        members: [],
        shares: [],
        team: { id: '1', name: 'Team 1', members: [] },
        status: 'pending',
      };

      setBills((prev) => [...prev, newBill]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bill');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateBill = async (billId: string, updates: Partial<Bill>) => {
    try {
      setIsLoading(true);
      setError(null);

      console.warn('Not implemented');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bill');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getBillsByTeam = async (teamId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      setBills([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team bills');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const settleBill = async (bill: Bill) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!bill.paidBy.nwcCredentials) {
        throw new Error('Paid by member has no NWC credentials');
      }

      const nwcClientReceiver = new nwc.NWCClient({
        nostrWalletConnectUrl: bill.paidBy.nwcCredentials,
      });

      await Promise.all(
        bill.shares.map(async (share) => {
          if (share.member.id === bill.paidBy.id) {
            console.info('Receiver, skipping');
            return;
          }
          return collectShare(share, nwcClientReceiver);
        }),
      );

      // Close NWC client
      nwcClientReceiver.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to settle bill');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BillContext.Provider
      value={{
        bills,
        currentBill,
        isLoading,
        error,
        createBill,
        updateBill,
        getBillsByTeam,
        settleBill,
        setCurrentBill,
      }}
    >
      {children}
    </BillContext.Provider>
  );
}

export function useBill() {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
}
