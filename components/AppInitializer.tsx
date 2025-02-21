'use client';

import { useEffect } from 'react';

export function AppInitializer() {
  useEffect(() => {
    // Wipe userSettings from localStorage when the app boots
    localStorage.removeItem('userSettings');
    console.log('userSettings wiped from localStorage');
  }, []);

  return null;
}
