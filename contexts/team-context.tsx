'use client';

import { Member } from '@/types/member';
import { Team } from '@/types/team';
import { createContext, useContext, useState, ReactNode } from 'react';

interface TeamContextType {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  joinTeam: (teamId: string) => Promise<void>;
  leaveTeam: () => void;
  isLoading: boolean;
  error: string | null;
  members: Member[];
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

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
