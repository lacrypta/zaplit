'use client';

import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import NDK, { NDKEvent, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import type { NostrEvent, NDKFilter, NDKSubscription } from '@nostr-dev-kit/ndk';

interface NDKContextType {
  fetchEvents: (filter: NDKFilter) => Promise<Set<NDKEvent>>;
  publishEvent: (event: Pick<NostrEvent, 'content' | 'kind' | 'tags'>) => Promise<NDKEvent>;
  setSigner: (privateKey: NDKPrivateKeySigner) => void;
  pubkey: string;
  subscribe: (filter: NDKFilter, opts?: { closeOnEose?: boolean; groupable?: boolean }) => Promise<NDKSubscription>;
}

const NDKContext = createContext<NDKContextType | null>(null);

export const NDKProvider = ({ children }: { children: ReactNode }) => {
  const [ndk, setNdk] = useState<NDK | null>(null);
  const [pubkey, setPubkey] = useState<string>('');

  const _initNDK = async (signer?: NDKPrivateKeySigner) => {
    const ndkInstance = ndk
      ? ndk
      : new NDK({
          explicitRelayUrls: ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.nostr.band', 'wss://relay.hodl.ar'],
        });
    if (signer) {
      ndkInstance.signer = signer;
      setPubkey((await ndkInstance.signer.user()).pubkey);
    }

    await ndkInstance.connect();
    setNdk(ndkInstance);
  };
  const initNDK = useCallback(_initNDK, [ndk]);

  useEffect(() => {
    initNDK();
  }, []);

  const setSigner = useCallback(
    (signer: NDKPrivateKeySigner) => {
      initNDK(signer);
    },
    [initNDK],
  );

  const _fetchEvents = async (filter: NDKFilter): Promise<Set<NDKEvent>> => {
    console.log('ndk', ndk);
    if (!ndk) throw new Error('NDK not initialized');
    return await ndk.fetchEvents(filter);
  };
  const fetchEvents = useCallback(_fetchEvents, [ndk]);

  const _publishEvent = async (partialEvent: Pick<NostrEvent, 'content' | 'kind' | 'tags'>): Promise<NDKEvent> => {
    if (!ndk) throw new Error('NDK not initialized');
    if (!ndk.signer || !pubkey) throw new Error('No signer configured');
    const event = {
      ...partialEvent,
      created_at: Math.floor(Date.now() / 1000),
      pubkey,
    };
    console.log('Publishing event', event);
    const ndkEvent = new NDKEvent(ndk, event);
    await ndkEvent.publish();
    return ndkEvent;
  };
  const publishEvent = useCallback(_publishEvent, [ndk, ndk?.signer, pubkey]);

  const _subscribe = async (
    filter: NDKFilter,
    opts: { closeOnEose?: boolean; groupable?: boolean } = {},
  ): Promise<NDKSubscription> => {
    if (!ndk) throw new Error('NDK not initialized');
    return ndk.subscribe(filter, opts);
  };
  const subscribe = useCallback(_subscribe, [ndk]);

  return (
    <NDKContext.Provider
      value={{
        fetchEvents,
        publishEvent,
        setSigner,
        pubkey,
        subscribe,
      }}
    >
      {children}
    </NDKContext.Provider>
  );
};

export const useNDK = () => {
  const context = useContext(NDKContext);
  if (!context) {
    throw new Error('useNDK must be used within an NDKProvider');
  }
  return context;
};
