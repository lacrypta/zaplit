import type React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppInitializer } from '@/components/AppInitializer';
import { TeamProvider } from '../contexts/team-context';
import { NDKProvider } from '../contexts/NDKContext';
import { NWCProvider } from '../contexts/nwc-context'; // Importamos el nuevo provider
import { BillProvider } from '../contexts/bill-context';

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
        <NDKProvider>
          <TeamProvider>
            <NWCProvider>
              <BillProvider>
                <AppInitializer />
                {children}
              </BillProvider>
            </NWCProvider>
          </TeamProvider>
        </NDKProvider>
      </body>
    </html>
  );
}
