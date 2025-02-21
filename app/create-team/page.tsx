'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teamId = generateRandomId();
    router.push(`/team/${teamId}?name=${encodeURIComponent(teamName)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create Team</h1>
          <p className="mt-2 text-gray-400">Enter a name for your new team</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            placeholder="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full py-6 text-lg"
            required
          />
          <Button type="submit" className="w-full py-6 text-lg" size="lg">
            Create Team
          </Button>
        </form>
      </div>
    </main>
  );
}
