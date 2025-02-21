'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { QrReader } from 'react-qr-reader';

export default function JoinTeam() {
  const router = useRouter();

  const handleScan = (result: any, error: any) => {
    if (result) {
      const teamId = result?.text;
      if (teamId) {
        router.push(`/team/${teamId}`);
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
        <Button onClick={() => router.back()} className="mt-4 w-full" variant="outline">
          Cancel Scanning
        </Button>
      </div>
    </div>
  );
}
