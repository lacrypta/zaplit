'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, AlertTriangle, Settings } from 'lucide-react';
import { TabNavBar } from '@/components/TabNavBar';
import { mockMembers } from '@/lib/mockData';

type MemberStatus = 'joined' | 'pending' | 'invited' | 'not_configured';

type Member = {
  id: string;
  name: string;
  avatarUrl: string;
  status: MemberStatus;
  isOwner?: boolean;
  hasNWC?: boolean;
};

export default function TeamDetails({ params }: { params: { id: string } }) {
  const [teamName, setTeamName] = useState('Loading...');
  // Inicializamos el owner con NWC no configurado
  const [members, setMembers] = useState<Member[]>([{
    id: mockMembers.owner.id,
    name: mockMembers.owner.name,
    avatarUrl: mockMembers.owner.avatarUrl,
    status: 'not_configured',
    isOwner: true,
    hasNWC: false
  }]);
  
  // Estado para controlar si NWC está configurado
  const [isNWCConfigured, setIsNWCConfigured] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const name = searchParams.get('name');
    setTeamName(name ? name : `Team ${params.id}`);
  }, [searchParams, params.id]);

  // Efecto para manejar la simulación después de configurar NWC
  useEffect(() => {
    if (isNWCConfigured) {
      // Actualizamos primero el estado del owner
      setMembers(prev => prev.map(member => 
        member.isOwner ? { ...member, status: 'joined', hasNWC: true } : member
      ));

      // Iniciamos la simulación de nuevos miembros
      let currentIndex = 0;
      const joinInterval = setInterval(() => {
        if (currentIndex < mockMembers.potentialMembers.length) {
          const memberToAdd = mockMembers.potentialMembers[currentIndex];
          setMembers(prevMembers => {
            if (prevMembers.some(m => m.id === memberToAdd.id)) return prevMembers;
            return [...prevMembers, { ...memberToAdd, status: 'pending' }];
          });

          setTimeout(() => {
            setMembers(prevMembers => 
              prevMembers.map(member => 
                member.id === memberToAdd.id 
                  ? { ...member, status: 'joined' }
                  : member
              )
            );
          }, 1000);

          currentIndex++;
        } else {
          clearInterval(joinInterval);
        }
      }, 3000);

      return () => clearInterval(joinInterval);
    }
  }, [isNWCConfigured]);

  const goToSettings = () => {
    router.push('/settings');
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
                    <div className="flex flex-col">
                      <span>{member.name}</span>
                      {member.isOwner && (
                        <span className="text-xs text-gray-400">Owner</span>
                      )}
                    </div>
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

          {/* Banner de advertencia para configurar NWC */}
          {!isNWCConfigured && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <p className="text-yellow-500">Configure NWC to start using the app</p>
                </div>
                <Button
                  onClick={goToSettings}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Update Settings</span>
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={() => setIsNWCConfigured(true)} // Temporal para simular
            className="w-full py-6 text-lg"
            size="lg"
            disabled={!isNWCConfigured || members.length === mockMembers.potentialMembers.length + 1}
          >
            Invite User
          </Button>
        </div>
      </main>
      <TabNavBar />
    </div>
  );
}