'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

type Currency = 'SAT' | 'USD' | 'BRL';

export default function AddBill() {
  const router = useRouter();
  const [amount, setAmount] = useState('0');
  const [currency, setCurrency] = useState<Currency>('SAT');

  const handleNumberClick = (num: string) => {
    setAmount((prev) => {
      if (prev === '0') return num;
      return prev + num;
    });
  };

  const handleDecimalClick = () => {
    if (!amount.includes('.')) {
      setAmount((prev) => prev + '.');
    }
  };

  const handleDeleteClick = () => {
    setAmount((prev) => {
      if (prev.length === 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const handlePay = () => {
    console.log(`Paying ${amount} ${currency}`);
    // Navigate to the bill details page
    router.push('/bills/details');
  };

  const handleScanInvoice = () => {
    console.log('Scanning invoice...');
    // TODO: Implement invoice scanning logic
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-grow overflow-y-auto pb-16">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Add New Bill</h1>

          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="text-center mb-4">
              <span className="text-4xl font-bold">{amount}</span>
            </div>
            <div className="flex rounded-md shadow-sm" role="group">
              {(['SAT', 'USD', 'BRL'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`flex-1 px-4 py-2 text-sm font-medium 
                    ${currency === curr ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} 
                    border border-gray-700 
                    ${curr === 'SAT' ? 'rounded-l-lg' : ''} 
                    ${curr === 'BRL' ? 'rounded-r-lg' : ''}
                  `}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="text-2xl py-6 bg-gray-800 hover:bg-gray-700"
              >
                {num}
              </Button>
            ))}
            <Button onClick={handleDecimalClick} className="text-2xl py-6 bg-gray-800 hover:bg-gray-700">
              .
            </Button>
            <Button onClick={() => handleNumberClick('0')} className="text-2xl py-6 bg-gray-800 hover:bg-gray-700">
              0
            </Button>
            <Button onClick={handleDeleteClick} className="text-2xl py-6 bg-gray-800 hover:bg-gray-700">
              ←
            </Button>
          </div>

          <Button onClick={handleScanInvoice} className="w-full mb-4 py-6 text-lg" variant="secondary">
            <QrCode className="mr-2 h-5 w-5" /> Scan Invoice
          </Button>

          <div className="flex space-x-4">
            <Button onClick={handleCancel} className="flex-1 py-6 text-lg" variant="outline">
              Cancel
            </Button>
            <Button onClick={handlePay} className="flex-1 py-6 text-lg">
              Pay
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
