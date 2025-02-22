'use client';

import { Member } from '@/types/member';
import { Team } from '@/types/team';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useNDK } from '@/contexts/NDKContext';
import { generateShortId } from '@/lib/utils';

interface TeamContextType {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  joinTeam: (teamId: string) => Promise<void>;
  leaveTeam: () => void;
  isLoading: boolean;
  error: string | null;
  members: Member[];
  createTeam: (name: string) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const { publishEvent } = useNDK();

  const joinTeam = async (teamId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Join team
      // setCurrentTeam(team);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const leaveTeam = () => {
    // TODO: Add API call to leave team
    setCurrentTeam(null);
  };

  const createTeam = useCallback(
    async (name: string) => {
      const teamId = generateShortId(name);
      const content = JSON.stringify({ name, teamId });
      const event = {
        kind: 30003,
        content,
        tags: [
          ['d', `zaplit:team:${teamId}`],
          ['L', 'zaplit:team'],
          ['l', teamId, 'zaplit:team'],
        ],
      };
      const publishedEvent = await publishEvent(event);
      setCurrentTeam({ id: teamId, name, members: [], eventId: publishedEvent.id });
    },
    [publishEvent],
  );

  return (
    <TeamContext.Provider
      value={{
        currentTeam,
        setCurrentTeam,
        joinTeam,
        leaveTeam,
        isLoading,
        error,
        members,
        createTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
