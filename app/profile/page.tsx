'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings } from 'lucide-react';
import { TabNavBar } from '@/components/TabNavBar';

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('John Doe');
  const [spentAmount, setSpentAmount] = useState(0);
  const [availableAmount, setAvailableAmount] = useState(0);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const { name } = JSON.parse(savedSettings);
      setName(name || 'John Doe');
      setSettingsSaved(true);
      setSpentAmount(5000);
      setAvailableAmount(10000);
    } else {
      setSettingsSaved(false);
    }
  }, []);

  const navigateToSettings = () => {
    router.push('/settings');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow overflow-y-auto pb-16">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>

          <div className="bg-gray-900 rounded-lg p-6 mb-6 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile picture" />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{name}</h2>
              </div>
            </div>
            {settingsSaved && (
              <div className="space-y-2 mb-4">
                <p className="text-gray-400">Spent amount: {spentAmount} sats</p>
                <p className="text-gray-400">Available amount: {availableAmount} sats</p>
              </div>
            )}
            <Button className="w-full" onClick={navigateToSettings}>
              <Settings className="mr-2 h-4 w-4" /> Update Settings
            </Button>
          </div>
        </div>
      </main>

      <TabNavBar />
    </div>
  );
}
