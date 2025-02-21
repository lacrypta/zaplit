'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

export default function JoinTeam() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);

  const mockScanQRCode = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Navigate to a mock team page after "scanning"
      router.push('/team/mock-team-id');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Join Team</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <QrCode className="w-32 h-32 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-6">Scan the QR code shared by your team</p>
          <Button onClick={mockScanQRCode} className="w-full text-lg py-6" size="lg" disabled={isScanning}>
            {isScanning ? 'Scanning...' : 'Mock Scan QR Code'}
          </Button>
        </div>
      </div>
    </div>
  );
}
