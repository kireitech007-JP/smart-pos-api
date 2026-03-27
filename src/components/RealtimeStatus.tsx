import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { testRealtimeConnection } from '@/lib/supabaseRealtime';

interface RealtimeStatusProps {
  onManualSync?: () => void;
  isConnected?: boolean;
}

const RealtimeStatus: React.FC<RealtimeStatusProps> = ({ 
  onManualSync, 
  isConnected = false 
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isTesting, setIsTesting] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load last sync time dari localStorage
    const savedLastSync = localStorage.getItem('lastSyncTime');
    if (savedLastSync) {
      setLastSync(new Date(savedLastSync));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Listen for sync events
    const handleSyncStart = () => {
      setSyncStatus('syncing');
    };

    const handleSyncSuccess = () => {
      setSyncStatus('success');
      setLastSync(new Date());
      localStorage.setItem('lastSyncTime', new Date().toISOString());
      setTimeout(() => setSyncStatus('idle'), 2000);
    };

    const handleSyncError = () => {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    };

    window.addEventListener('sync-start', handleSyncStart);
    window.addEventListener('sync-success', handleSyncSuccess);
    window.addEventListener('sync-error', handleSyncError);

    return () => {
      window.removeEventListener('sync-start', handleSyncStart);
      window.removeEventListener('sync-success', handleSyncSuccess);
      window.removeEventListener('sync-error', handleSyncError);
    };
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const connected = await testRealtimeConnection();
      if (connected) {
        toast.success('Koneksi Supabase Realtime berhasil');
      } else {
        toast.error('Gagal terhubung ke Supabase Realtime');
      }
    } catch (error) {
      toast.error('Error testing koneksi');
    } finally {
      setIsTesting(false);
    }
  };

  const handleManualSync = async () => {
    setSyncStatus('syncing');
    window.dispatchEvent(new CustomEvent('sync-start'));
    
    try {
      if (onManualSync) {
        await onManualSync();
      }
      window.dispatchEvent(new CustomEvent('sync-success'));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('sync-error'));
    }
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  const getStatusColor = () => {
    if (!isOnline) return 'destructive';
    if (syncStatus === 'syncing') return 'default';
    if (syncStatus === 'error') return 'destructive';
    if (isConnected) return 'default';
    return 'secondary';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (syncStatus === 'syncing') return 'Sinkronisasi...';
    if (syncStatus === 'error') return 'Error';
    if (isConnected) return 'Realtime Aktif';
    return 'Tidak Terhubung';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (syncStatus === 'syncing') return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (syncStatus === 'error') return <AlertCircle className="w-4 h-4" />;
    if (isConnected) return <CheckCircle className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant={getStatusColor()} className="flex items-center gap-2">
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
            
            {lastSync && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                Sync: {formatLastSync(lastSync)}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting || !isOnline}
              className="h-8"
            >
              {isTesting ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                'Test'
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSync}
              disabled={syncStatus === 'syncing' || !isOnline}
              className="h-8"
            >
              {syncStatus === 'syncing' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        {!isOnline && (
          <div className="mt-2 text-sm text-destructive">
            <WifiOff className="w-3 h-3 inline mr-1" />
            Tidak ada koneksi internet. Real-time sync tidak akan berfungsi.
          </div>
        )}

        {isOnline && !isConnected && syncStatus === 'idle' && (
          <div className="mt-2 text-sm text-muted-foreground">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            Real-time sync tidak aktif. Data mungkin tidak sinkron antar perangkat.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealtimeStatus;
