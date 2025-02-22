'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definimos el tipo para nuestro contexto
type NWCContextType = {
  isNWCConfigured: boolean;
  nwcPublicKey: string | null;
  configureNWC: (publicKey: string) => void;
  disconnectNWC: () => void;
};

// Creamos el contexto
const NWCContext = createContext<NWCContextType | undefined>(undefined);

// Creamos el provider que mantendrá el estado global de NWC
export function NWCProvider({ children }: { children: ReactNode }) {
  const [isNWCConfigured, setIsNWCConfigured] = useState(false);
  const [nwcPublicKey, setNwcPublicKey] = useState<string | null>(null);

  // Verificamos el estado guardado al cargar
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.nwcString) {
        setNwcPublicKey(settings.nwcString);
        setIsNWCConfigured(true);
      }
    }
  }, []);

  // Función para configurar NWC
  const configureNWC = (publicKey: string) => {
    setNwcPublicKey(publicKey);
    setIsNWCConfigured(true);
  };

  // Función para desconectar NWC
  const disconnectNWC = () => {
    setNwcPublicKey(null);
    setIsNWCConfigured(false);
  };

  return (
    <NWCContext.Provider
      value={{
        isNWCConfigured,
        nwcPublicKey,
        configureNWC,
        disconnectNWC
      }}
    >
      {children}
    </NWCContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useNWC() {
  const context = useContext(NWCContext);
  if (context === undefined) {
    throw new Error('useNWC must be used within a NWCProvider');
  }
  return context;
}