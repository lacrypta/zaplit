'use client';

import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import NDK, { NDKEvent, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import type { NostrEvent, NDKFilter } from '@nostr-dev-kit/ndk';

interface NDKContextType {
  fetchEvents: (filter: NDKFilter) => Promise<Set<NDKEvent>>;
  publishEvent: (event: NostrEvent) => Promise<void>;
  setSignerPrivateKey: (privateKey: string) => void;
}

const NDKContext = createContext<NDKContextType | null>(null);

export const NDKProvider = ({ children }: { children: ReactNode }) => {
  const [ndk, setNdk] = useState<NDK | null>(null);

  const initNDK = async (privateKey?: string) => {
    let signer;
    if (privateKey) {
      signer = new NDKPrivateKeySigner(privateKey);
    }

    const ndkInstance = new NDK({
      explicitRelayUrls: ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.nostr.band'],
      signer,
    });

    await ndkInstance.connect();
    console.log('ndkInstance', ndkInstance);
    setNdk(ndkInstance);
  };

  useEffect(() => {
    initNDK();
  }, []);

  const setSignerPrivateKey = (privateKey: string) => {
    initNDK(privateKey);
  };

  const _fetchEvents = async (filter: NDKFilter): Promise<Set<NDKEvent>> => {
    console.log('ndk', ndk);
    if (!ndk) throw new Error('NDK not initialized');
    return await ndk.fetchEvents(filter);
  };
  const fetchEvents = useCallback(_fetchEvents, [ndk]);

  const _publishEvent = async (event: NostrEvent): Promise<void> => {
    if (!ndk) throw new Error('NDK not initialized');
    if (!ndk.signer) throw new Error('No signer configured');
    await new NDKEvent(ndk, event).publish();
  };
  const publishEvent = useCallback(_publishEvent, [ndk, ndk?.signer]);

  return (
    <NDKContext.Provider value={{ fetchEvents, publishEvent, setSignerPrivateKey }}>{children}</NDKContext.Provider>
  );
};

export const useNDK = () => {
  const context = useContext(NDKContext);
  if (!context) {
    throw new Error('useNDK must be used within an NDKProvider');
  }
  return context;
};
