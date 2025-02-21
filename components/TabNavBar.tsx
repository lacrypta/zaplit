'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Receipt, UserCircle } from 'lucide-react';

export function TabNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="bg-gray-900 fixed bottom-0 left-0 right-0 border-t border-gray-800">
      <ul className="flex justify-around">
        <li className="flex-1">
          <Button
            variant="ghost"
            className={`w-full h-16 px-1 hover:bg-gray-800 
              ${isActive('/bills') ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => router.push('/bills')}
          >
            <div className="flex flex-col items-center">
              <Receipt className="h-6 w-6" />
              <span className="mt-1 text-xs">Bills</span>
            </div>
          </Button>
        </li>
        <li className="flex-1">
          <Button
            variant="ghost"
            className={`w-full h-16 px-1 hover:bg-gray-800 
              ${isActive('/team') ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => router.push('/team/1')}
          >
            <div className="flex flex-col items-center">
              <Users className="h-6 w-6" />
              <span className="mt-1 text-xs">Group</span>
            </div>
          </Button>
        </li>
        <li className="flex-1">
          <Button
            variant="ghost"
            className={`w-full h-16 px-1 hover:bg-gray-800 
              ${isActive('/profile') ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => router.push('/profile')}
          >
            <div className="flex flex-col items-center">
              <UserCircle className="h-6 w-6" />
              <span className="mt-1 text-xs">Profile</span>
            </div>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
