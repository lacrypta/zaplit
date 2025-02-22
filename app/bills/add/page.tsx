'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { createNewBill, getStoredBills, storeBills, mockMembers } from '@/lib/mockData';

type Currency = 'SAT' | 'USD' | 'BRL';

export default function AddBill() {
  const router = useRouter();
  const [amount, setAmount] = useState('0');
  const [currency, setCurrency] = useState<Currency>('SAT');
  const [isProcessing, setIsProcessing] = useState(false);

  // Función mejorada para manejar los clicks en números
  const handleNumberClick = (num: string) => {
    setAmount((prev) => {
      // Evitamos números demasiado largos
      if (prev.length >= 10) return prev;
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

  // Función mejorada para crear y guardar el nuevo bill
  const handleCreateBill = async () => {
    try {
      setIsProcessing(true);

      // Convertimos el amount a número y validamos
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Invalid amount');
      }

      // Obtenemos los miembros activos del grupo
      const activeMembers = [
        mockMembers.owner,
        ...mockMembers.potentialMembers.filter(member => member.status === 'joined')
      ];

      // Creamos el nuevo bill
      const newBill = createNewBill(numericAmount, currency, activeMembers);

      // Obtenemos los bills existentes y añadimos el nuevo
      const currentBills = getStoredBills();
      const updatedBills = [newBill, ...currentBills];
      
      // Guardamos los bills actualizados
      storeBills(updatedBills);

      // Redirigimos a la página de detalles del nuevo bill
      router.push(`/bills/${newBill.id}`);
    } catch (error) {
      console.error('Error creating bill:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanInvoice = async () => {
    try {
      setIsProcessing(true);
      // Simulamos un escaneo que tarda 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Establecemos un monto de ejemplo
      setAmount('1000');
      setCurrency('SAT');
    } catch (error) {
      console.error('Error scanning invoice:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-grow overflow-y-auto pb-16">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Add New Bill</h1>
          
          {/* Display del monto */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="text-center mb-4">
              <span className="text-4xl font-bold">{amount}</span>
            </div>
            
            {/* Selector de moneda */}
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

          {/* Teclado numérico */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                className="text-2xl py-6 bg-gray-800 hover:bg-gray-700"
                disabled={isProcessing}
              >
                {num}
              </Button>
            ))}
            <Button 
              onClick={handleDecimalClick} 
              className="text-2xl py-6 bg-gray-800 hover:bg-gray-700"
              disabled={isProcessing}
            >
              .
            </Button>
            <Button 
              onClick={() => handleNumberClick('0')} 
              className="text-2xl py-6 bg-gray-800 hover:bg-gray-700"
              disabled={isProcessing}
            >
              0
            </Button>
            <Button 
              onClick={handleDeleteClick} 
              className="text-2xl py-6 bg-gray-800 hover:bg-gray-700"
              disabled={isProcessing}
            >
              ←
            </Button>
          </div>

          {/* Botones de acción */}
          <Button 
            onClick={handleScanInvoice} 
            className="w-full mb-4 py-6 text-lg" 
            variant="secondary"
            disabled={isProcessing}
          >
            <QrCode className="mr-2 h-5 w-5" /> 
            {isProcessing ? 'Scanning...' : 'Scan Invoice'}
          </Button>

          <div className="flex space-x-4">
            <Button 
              onClick={handleCancel} 
              className="flex-1 py-6 text-lg" 
              variant="outline"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateBill} 
              className="flex-1 py-6 text-lg"
              disabled={isProcessing || amount === '0'}
            >
              {isProcessing ? 'Creating...' : 'Create Bill'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}