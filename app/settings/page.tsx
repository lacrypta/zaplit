'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft, QrCode, Info, Check } from 'lucide-react';
import { useNWC } from '@/contexts/nwc-context';

interface UserSettings {
  name: string;
  nwcString: string;
  enableNWCProxy: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { configureNWC } = useNWC();

  const [name, setName] = useState('');
  const [nwcString, setNwcString] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [enableNWCProxy, setEnableNWCProxy] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings: UserSettings = JSON.parse(savedSettings);
      setName(settings.name || '');
      setNwcString(settings.nwcString || '');
      setEnableNWCProxy(settings.enableNWCProxy || false);

      // Si hay una nwcString guardada, la validamos
      if (settings.nwcString) {
        validateNWCString(settings.nwcString);
      }
    }
  }, []);

  // Función para validar el formato de NWC string
  const validateNWCString = (value: string) => {
    // Aquí implementarías la validación real del formato NWC
    // Por ahora usamos una validación simple
    const isValidFormat = value.startsWith('nostr+walletconnect://');
    setIsValid(isValidFormat);
    return isValidFormat;
  };

  const handleNWCStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNwcString(value);
    validateNWCString(value);
  };

  const handleScanQR = async () => {
    setIsScanning(true);
    try {
      // Aquí iría la implementación real del escaneo QR
      // Por ahora simulamos un delay y un resultado
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const scannedValue = 'nostr+walletconnect://example-valid-string';
      setNwcString(scannedValue);
      validateNWCString(scannedValue);
    } catch (error) {
      console.error('Error scanning QR:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validamos el NWC string antes de guardar
      if (nwcString && !validateNWCString(nwcString)) {
        throw new Error('Invalid NWC string format');
      }

      // Guardamos los settings localmente
      const settings: UserSettings = { name, nwcString, enableNWCProxy };
      localStorage.setItem('userSettings', JSON.stringify(settings));

      // Configuramos NWC en el contexto global
      if (nwcString) {
        await configureNWC(nwcString);
      }

      // Redirigimos después de guardar exitosamente
      router.push('/profile');
    } catch (error) {
      console.error('Error saving settings:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow overflow-y-auto pb-16">
        <div className="p-6">
          <Button variant="ghost" className="mb-4 text-white" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

          <div className="bg-gray-900 rounded-lg p-6 space-y-6 text-white">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nwc-string" className="flex items-center">
                NWC String
                {isValid && <Check className="ml-2 h-4 w-4 text-green-500" />}
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="nwc-string"
                  value={nwcString}
                  onChange={handleNWCStringChange}
                  placeholder="Enter NWC string"
                  className={`bg-gray-800 border-gray-700 ${nwcString && !isValid ? 'border-red-500' : ''}`}
                />
                <Button onClick={handleScanQR} disabled={isScanning}>
                  {isScanning ? 'Scanning...' : <QrCode className="h-4 w-4" />}
                </Button>
              </div>
              {nwcString && !isValid && <p className="text-sm text-red-500 mt-1">Invalid NWC string format</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="nwc-proxy" checked={enableNWCProxy} onCheckedChange={setEnableNWCProxy} disabled={true} />
              <Label htmlFor="nwc-proxy" className="flex items-center">
                Enable NWC Proxy
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>NWC Proxy is currently unavailable</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
            </div>

            <Button onClick={handleSave} className="w-full" disabled={Boolean(isSaving || (nwcString && !isValid))}>
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
