import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import logo from '@/public/logo.png';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="relative w-48 h-48 mx-auto">
            <Image src={logo} alt="ZapSplit Logo" fill className="object-contain" priority />
          </div>
          <p className="text-xl text-white">Split bills using zaps</p>
        </div>
        <div className="space-y-4 pt-8">
          <Link href="/create-team" passHref>
            <Button className="w-full text-lg py-6" size="lg">
              Create Team
            </Button>
          </Link>
          <Link href="/join-team" passHref>
            <Button className="w-full text-lg py-6" variant="outline" size="lg">
              Join Team
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
