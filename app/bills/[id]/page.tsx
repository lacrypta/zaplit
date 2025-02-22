'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { TabNavBar } from '@/components/TabNavBar';
import { Bill, getStoredBills } from '@/lib/mockData';

// Ampliamos el tipo MemberStatus para incluir el estado de pago
type PaymentStatus = 'pending' | 'paid' | 'failed';

interface BillDetailsProps {
  params: {
    id: string;
  };
}

export default function BillDetails({ params }: BillDetailsProps) {
  const router = useRouter();
  const [bill, setBill] = useState<Bill | null>(null);
  const [memberStatuses, setMemberStatuses] = useState<Record<string, PaymentStatus>>({});

  // Cargamos los datos del bill específico
  useEffect(() => {
    const bills = getStoredBills();
    const currentBill = bills.find((b) => b.id === params.id);
    if (currentBill) {
      setBill(currentBill);
      // Inicializamos los estados de pago
      const initialStatuses: Record<string, PaymentStatus> = {};
      currentBill.members.forEach((member) => {
        initialStatuses[member.id] = member.hasPaid ? 'paid' : 'pending';
      });
      setMemberStatuses(initialStatuses);
    }
  }, [params.id]);

  // Simulamos el proceso de pago
  useEffect(() => {
    if (!bill) return;

    const processPayments = async () => {
      // Procesamos el pago para cada miembro secuencialmente
      for (const member of bill.members) {
        if (member.hasPaid) continue; // Saltamos miembros que ya pagaron

        await new Promise((resolve) => setTimeout(resolve, 1500));
        setMemberStatuses((prev) => ({
          ...prev,
          [member.id]: Math.random() > 0.2 ? 'paid' : 'failed', // 80% de éxito
        }));
      }
    };

    processPayments();
  }, [bill]);

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'paid':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  if (!bill) {
    return <div>Loading...</div>;
  }

  const completedPayments = Object.values(memberStatuses).filter((status) => status === 'paid').length;
  const progress = (completedPayments / bill.members.length) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 to-purple-600">
      <main className="flex-grow overflow-y-auto pb-16">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Bill Details</h1>

          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {bill.amount} {bill.currency}
              </p>
              <p className="text-gray-600 mt-2">
                {bill.date} {bill.time}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-2">Collecting shares</h2>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-gray-600">
              {completedPayments} of {bill.members.length} shares collected
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Members</h2>
            <ul className="space-y-4">
              {bill.members.map((member) => (
                <li key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>
                      {member.share} {bill.currency}
                    </span>
                    {getStatusIcon(memberStatuses[member.id] || 'pending')}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Button onClick={() => router.push('/bills')} className="w-full py-6 text-lg" size="lg">
            Close
          </Button>
        </div>
      </main>
      <TabNavBar />
    </div>
  );
}
