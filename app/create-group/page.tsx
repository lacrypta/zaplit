'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNDK } from '@/contexts/NDKContext';
import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useTeam } from '@/contexts/team-context';

const PRIVKEY_LOCAL_STORAGE_KEY = 'zaplit-privkey';

const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const router = useRouter();
  const { setSigner } = useNDK();
  const { createTeam, currentTeam } = useTeam();

  useEffect(() => {
    let privkey = localStorage.getItem(PRIVKEY_LOCAL_STORAGE_KEY);
    if (!privkey) {
      privkey = NDKPrivateKeySigner.generate().privateKey!;
      localStorage.setItem(PRIVKEY_LOCAL_STORAGE_KEY, privkey);
    }
    setSigner(new NDKPrivateKeySigner(privkey));
  }, [setSigner]);

  useEffect(() => {
    if (currentTeam) {
      router.push(`/team/${currentTeam.id}`);
    }
  }, [currentTeam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTeam(teamName);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create Group</h1>
          <p className="mt-2 text-gray-400">Enter a name for your new group</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full py-6 text-lg text-white bg-transparent border-white/20 placeholder:text-gray-400"
            required
          />
          <Button type="submit" className="w-full py-6 text-lg" size="lg">
            Create Group
          </Button>
        </form>
      </div>
    </main>
  );
}
