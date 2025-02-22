import type React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppInitializer } from '@/components/AppInitializer';
import { TeamProvider } from '../contexts/team-context';
import { NWCProvider } from '../contexts/nwc-context';  // Importamos el nuevo provider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Zaplit',
  description: 'Split bills using zaps',
  generator: 'v0.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TeamProvider>
          <NWCProvider>  {/* Añadimos el NWCProvider dentro del TeamProvider */}
            <AppInitializer />
            {children}
          </NWCProvider>
        </TeamProvider>
      </body>
    </html>
  );
}