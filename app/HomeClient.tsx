'use client';

import { useEffect } from 'react';

export default function HomeClient() {
  useEffect(() => {
    console.log('HomeClient mounted');
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black">
      <h1 className="text-4xl font-bold text-white">Welcome to ZapSplit</h1>
    </main>
  );
}
