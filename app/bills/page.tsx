'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TabNavBar } from '@/components/TabNavBar';

type Bill = {
  id: string;
  date: string;
  time: string;
  individualAmount: number;
  totalAmount: number;
};

export default function BillsPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([
    { id: '1', date: 'Today', time: '14:30', individualAmount: 1000, totalAmount: 4000 },
    { id: '2', date: 'Yesterday', time: '19:45', individualAmount: 1500, totalAmount: 6000 },
    { id: '3', date: '3 days ago', time: '12:15', individualAmount: 1000, totalAmount: 4000 },
    { id: '4', date: '24th May', time: '09:00', individualAmount: 1500, totalAmount: 6000 },
    { id: '5', date: '20th May', time: '20:30', individualAmount: 750, totalAmount: 3000 },
    { id: '6', date: '15th May', time: '13:45', individualAmount: 2000, totalAmount: 8000 },
    { id: '7', date: '10th May', time: '18:00', individualAmount: 1250, totalAmount: 5000 },
  ]);

  const addNewBill = () => {
    router.push('/bills/add');
  };

  const viewBillDetails = (id: string) => {
    router.push(`/bills/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow overflow-y-auto pb-16">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-6">Bills</h1>

          <Button onClick={addNewBill} className="w-full py-6 text-lg mb-6" size="lg">
            <Plus className="mr-2 h-5 w-5" /> Add New Bill
          </Button>

          <div className="space-y-4">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="bg-gray-900 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-800 text-white"
                onClick={() => viewBillDetails(bill.id)}
              >
                <div>
                  <p className="font-semibold">{bill.date}</p>
                  <p className="text-sm text-gray-400">{bill.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {bill.individualAmount} / {bill.totalAmount} sats
                  </p>
                  <p className="text-xs text-gray-400">Your share / Total</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <TabNavBar />
    </div>
  );
}
