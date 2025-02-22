'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TabNavBar } from '@/components/TabNavBar';
import { Bill, getStoredBills } from '@/lib/mockData';

export default function BillsPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);

  // Cargamos los bills cuando el componente se monta
  useEffect(() => {
    const storedBills = getStoredBills();
    setBills(storedBills);
  }, []);

  // Función para formatear la fecha de manera relativa
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    // Para fechas más antiguas, mostramos el formato "24th May"
    return date
      .toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
      })
      .replace(',', '');
  };

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

          <Button onClick={addNewBill} className="w-full py-6 text-lg mb-6 flex items-center justify-center" size="lg">
            <Plus className="mr-2 h-5 w-5" /> Add New Bill
          </Button>

          {bills.length === 0 ? (
            // Mostramos un mensaje cuando no hay bills
            <div className="text-center text-gray-400 py-8">No bills yet. Create your first bill!</div>
          ) : (
            // Lista de bills existentes
            <div className="space-y-4">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="bg-gray-900 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-800 text-white transition-colors"
                  onClick={() => viewBillDetails(bill.id)}
                >
                  <div>
                    <p className="font-semibold">{formatRelativeDate(bill.date)}</p>
                    <p className="text-sm text-gray-400">{bill.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {bill.yourShare} / {bill.amount} {bill.currency}
                    </p>
                    <p className="text-xs text-gray-400">Your share / Total</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <TabNavBar />
    </div>
  );
}
