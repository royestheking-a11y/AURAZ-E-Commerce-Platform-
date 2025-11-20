import { useMongoSync } from '../lib/useMongoSync';
import { Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DataSyncIndicator() {
  const { isLoading, isInitialized } = useMongoSync();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if MongoDB API is accessible
  const [mongoStatus, setMongoStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkMongo = async () => {
      try {
        // Simple check - try to access the products API
        const response = await fetch('/api/products', {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });
        
        setMongoStatus(response.ok ? 'connected' : 'disconnected');
      } catch (error) {
        setMongoStatus('disconnected');
      }
    };

    if (isInitialized && isOnline) {
      checkMongo();
      // Check every 30 seconds
      const interval = setInterval(checkMongo, 30000);
      return () => clearInterval(interval);
    } else {
      setMongoStatus('disconnected');
    }
  }, [isInitialized, isOnline]);

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
        <Loader2 className="h-4 w-4 animate-spin text-[#591220]" />
        <span className="text-sm text-gray-600">Syncing...</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg px-3 py-2">
        <CloudOff className="h-4 w-4 text-yellow-600" />
        <span className="text-sm text-yellow-700">Offline</span>
      </div>
    );
  }

  if (mongoStatus === 'disconnected') {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg shadow-lg px-3 py-2">
        <CloudOff className="h-4 w-4 text-orange-600" />
        <span className="text-sm text-orange-700">Local Mode</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg shadow-lg px-3 py-2">
      <Cloud className="h-4 w-4 text-green-600" />
      <span className="text-sm text-green-700">Synced</span>
    </div>
  );
}

