import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import logo from '@/public/logo.png';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black">
      <div className="w-full max-w-md flex flex-col items-center gap-16">
        <div className="space-y-6">
          <div className="relative w-48 h-48 mx-auto">
            <Image src={logo} alt="Zaplit Logo" fill className="object-contain" priority />
          </div>
          <p className="text-xl text-white">Split bills using zaps</p>
        </div>
        <div className="w-full flex flex-col gap-8">
          <Link href="/create-group" passHref className="w-full">
            <Button className="w-full text-lg py-6" variant="outline" size="lg">
              Create Group
            </Button>
          </Link>
          <Link href="/join-group" passHref className="w-full">
            <Button className="w-full text-lg py-6" size="lg">
              Join Group
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
