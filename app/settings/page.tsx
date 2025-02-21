'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, QrCode, Info } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nwcString, setNwcString] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [enableNWCProxy, setEnableNWCProxy] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const { name, nwcString, enableNWCProxy } = JSON.parse(savedSettings);
      setName(name || '');
      setNwcString(nwcString || '');
      setEnableNWCProxy(enableNWCProxy || false);
    }
  }, []);

  const handleSave = () => {
    const settings = { name, nwcString, enableNWCProxy };
    localStorage.setItem('userSettings', JSON.stringify(settings));
    router.push('/profile');
  };

  const handleScanQR = () => {
    setIsScanning(true);
    setTimeout(() => {
      setNwcString('scanned-nwc-string-example');
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow overflow-y-auto pb-16">
        <div className="p-6">
          <Button variant="ghost" className="mb-4 text-white" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

          <div className="bg-gray-900 rounded-lg p-6 space-y-6 text-white">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nwc-string">NWC String</Label>
              <div className="flex space-x-2">
                <Input
                  id="nwc-string"
                  value={nwcString}
                  onChange={(e) => setNwcString(e.target.value)}
                  placeholder="Enter NWC string"
                  className="bg-gray-800 border-gray-700"
                />
                <Button onClick={handleScanQR} disabled={isScanning}>
                  {isScanning ? 'Scanning...' : <QrCode className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="nwc-proxy" checked={enableNWCProxy} onCheckedChange={setEnableNWCProxy} disabled={true} />
              <Label htmlFor="nwc-proxy" className="flex items-center">
                Enable NWC Proxy
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>NWC Proxy is currently unavailable</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
