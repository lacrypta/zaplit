'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, AlertTriangle } from 'lucide-react';
import { TabNavBar } from '@/components/TabNavBar';

type MemberStatus = 'joined' | 'pending';

type Member = {
  id: string;
  name: string;
  avatarUrl: string;
  status: MemberStatus;
};

export default function TeamDetails({ params }: { params: { id: string } }) {
  const [teamName, setTeamName] = useState('Loading...');
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'You', avatarUrl: '/placeholder.svg?height=40&width=40', status: 'joined' },
    { id: '2', name: 'Friend1', avatarUrl: '/placeholder.svg?height=40&width=40', status: 'joined' },
    { id: '3', name: 'Friend2', avatarUrl: '/placeholder.svg?height=40&width=40', status: 'pending' },
    { id: '4', name: 'Friend3', avatarUrl: '/placeholder.svg?height=40&width=40', status: 'joined' },
  ]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const name = searchParams.get('name');
    setTeamName(name ? name : `Team ${params.id}`);
  }, [searchParams, params.id]);

  const inviteUser = () => {
    router.push(`/team/${params.id}/invite`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow overflow-y-auto pb-16">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-6">{teamName}</h1>

          <div className="bg-gray-900 rounded-lg p-4 mb-6 text-white">
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
                  {member.status === 'joined' ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <Button onClick={inviteUser} className="w-full py-6 text-lg" size="lg">
            Invite User
          </Button>
        </div>
      </main>

      <TabNavBar />
    </div>
  );
}
