'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
//import { mockMembers } from '@/lib/mockData';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const [teamName, setTeamName] = useState('Loading...');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulamos obtener el nombre del equipo desde nuestro mockData
    setTeamName(`Team ${params.id}`);

    // Creamos el link de invitación
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/join-group?id=${params.id}`;
    setInviteLink(link);
  }, [params.id]);

  // Función para copiar el link de invitación
  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset después de 2 segundos
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-6">
      <Link href={`/team/${params.id}`} passHref>
        <Button variant="ghost" className="self-start text-white mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
        </Button>
      </Link>

      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-8">{teamName}</h1>

        {/* Sección del QR */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteLink)}`}
              alt="Invite QR Code"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>

          {/* Link de invitación */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">Invite Link</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-100 p-3 rounded-lg text-sm truncate">{inviteLink}</div>
              <Button onClick={copyInviteLink} variant="outline" className="flex-shrink-0">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="space-y-3 text-sm text-gray-600">
            <p className="font-medium">How to invite members:</p>
            <ol className="list-decimal pl-4 space-y-2">
              <li>Share the QR code or invite link with your friends</li>
              <li>They'll need to scan the QR or click the link</li>
              <li>Once they join, they'll appear in your team members list</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-white text-lg">Share privately with your friends</p>
          <p className="text-white/80 text-sm">Only share with people you trust to join your team</p>
        </div>
      </main>
    </div>
  );
}
