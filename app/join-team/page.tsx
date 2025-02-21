'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { QrReader } from 'react-qr-reader';
import { useTeam } from '@/contexts/team-context';

export default function JoinTeam() {
  const router = useRouter();
  const { joinTeam, isLoading, error } = useTeam();

  const handleScan = async (result: any, error: any) => {
    if (result) {
      const teamId = result?.text;
      if (teamId) {
        try {
          await joinTeam(teamId);
          router.push(`/team/${teamId}`);
        } catch (err) {
          console.error('Failed to join team:', err);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-500 to-purple-600">
      <QrReader
        constraints={{ facingMode: 'environment' }}
        onResult={handleScan}
        className="w-full h-full absolute inset-0"
      />
      <div className="flex flex-col items-center justify-center fixed bottom-0 mb-5 w-full px-8">
        {error && <p className="text-red-500 bg-white p-2 rounded mb-2 w-full text-center">{error}</p>}
        <Button onClick={() => router.back()} className="mt-4 w-full" variant="outline" disabled={isLoading}>
          {isLoading ? 'Joining...' : 'Cancel Scanning'}
        </Button>
      </div>
    </div>
  );
}
