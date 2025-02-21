'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InvitePage() {
  const params = useParams();
  const [teamName, setTeamName] = useState('Loading...');

  useEffect(() => {
    // In a real app, you'd fetch the team name from an API
    setTeamName(`Team ${params.id}`);
  }, [params.id]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-6">
      <Link href={`/team/${params.id}`} passHref>
        <Button variant="ghost" className="self-start text-white mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
        </Button>
      </Link>

      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-8">{teamName}</h1>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://splitzaps.com/join/${params.id}`}
            alt="Invite QR Code"
            width={200}
            height={200}
          />
        </div>

        <p className="text-white text-center mt-8 text-lg">Show this QR code privately to your friends</p>
      </main>
    </div>
  );
}
