'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { TabNavBar } from '@/components/TabNavBar';
import { MemberStatus, Member } from '@/types/member';

export default function BillDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [dateTime] = useState('2025-02-21 14:30');
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'You', avatarUrl: '/placeholder.svg?height=40&width=40', amount: 1000, status: 'pending' },
    { id: '2', name: 'Alice', avatarUrl: '/placeholder.svg?height=40&width=40', amount: 1000, status: 'pending' },
    { id: '3', name: 'Bob', avatarUrl: '/placeholder.svg?height=40&width=40', amount: 1000, status: 'pending' },
    { id: '4', name: 'Charlie', avatarUrl: '/placeholder.svg?height=40&width=40', amount: 1000, status: 'pending' },
  ]);

  useEffect(() => {
    const updateMemberStatus = (index: number, status: MemberStatus) => {
      setMembers((prevMembers) => prevMembers.map((member, i) => (i === index ? { ...member, status } : member)));
    };

    const timers = [
      setTimeout(() => updateMemberStatus(0, 'paid'), 1000),
      setTimeout(() => updateMemberStatus(1, 'paid'), 2500),
      setTimeout(() => updateMemberStatus(2, 'paid'), 3500),
      setTimeout(() => updateMemberStatus(3, 'failed'), 4500),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const getStatusIcon = (status: MemberStatus) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'paid':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const completedPayments = members.filter((member) => member.status !== 'pending').length;
  const progress = (completedPayments / members.length) * 100;
  const totalAmount = members.reduce((sum, member) => sum + member.amount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 to-purple-600">
      <main className="flex-grow overflow-y-auto pb-16">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-6">Bill Details</h1>

          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{totalAmount} sats</p>
              <p className="text-gray-600 mt-2">{dateTime}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-2">Collecting shares</h2>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-gray-600">
              {completedPayments} of {members.length} shares collected
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Members</h2>
            <ul className="space-y-4">
              {members.map((member) => (
                <li key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>{member.amount} sats</span>
                    {getStatusIcon(member.status)}
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
