import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Upload,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  autoSyncToSheets, 
  syncTransactionToSheets,
  syncProductToSheets,
  syncDebtToSheets,
  syncCashInToSheets,
  syncExpenseToSheets,
  testConnection
} from '@/lib/googleSheets';

interface SheetSyncButtonProps {
  mode?: 'auto' | 'transaction' | 'product' | 'debt' | 'cashin' | 'expense';
  data?: any;
  className?: string;
  showStatus?: boolean;
}

const SheetSyncButton: React.FC<SheetSyncButtonProps> = ({ 
  mode = 'auto', 
  data, 
  className = '',
  showStatus = true 
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      let result;
      
      switch (mode) {
        case 'auto':
          result = await autoSyncToSheets();
          break;
        case 'transaction':
          if (!data) {
            toast.error('Data transaksi tidak tersedia');
            return;
          }
          result = await syncTransactionToSheets(data);
          break;
        case 'product':
          if (!data) {
            toast.error('Data produk tidak tersedia');
            return;
          }
          result = await syncProductToSheets(data);
          break;
        case 'debt':
          if (!data) {
            toast.error('Data piutang tidak tersedia');
            return;
          }
          result = await syncDebtToSheets(data);
          break;
        case 'cashin':
          if (!data) {
            toast.error('Data kas masuk tidak tersedia');
            return;
          }
          result = await syncCashInToSheets(data);
          break;
        case 'expense':
          if (!data) {
            toast.error('Data pengeluaran tidak tersedia');
            return;
          }
          result = await syncExpenseToSheets(data);
          break;
        default:
          result = await autoSyncToSheets();
      }
      
      if (result.success) {
        setLastSync(new Date());
        toast.success(result.message || 'Data berhasil di-sync ke Google Sheets');
      } else {
        toast.error(result.error || 'Gagal sync data');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat sync data');
    } finally {
      setIsSyncing(false);
    }
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const result = await testConnection();
      if (result.success) {
        setConnectionStatus('connected');
        toast.success('Koneksi Google Sheets berhasil');
      } else {
        setConnectionStatus('error');
        toast.error('Gagal terhubung ke Google Sheets');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Error testing koneksi');
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'auto': return 'Sync All Data';
      case 'transaction': return 'Sync Transaksi';
      case 'product': return 'Sync Produk';
      case 'debt': return 'Sync Piutang';
      case 'cashin': return 'Sync Kas Masuk';
      case 'expense': return 'Sync Pengeluaran';
      default: return 'Sync to Sheets';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'auto': return FileSpreadsheet;
      case 'transaction': return Database;
      case 'product': return Upload;
      case 'debt': return Database;
      case 'cashin': return Database;
      case 'expense': return Database;
      default: return FileSpreadsheet;
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

  const StatusIcon = getModeIcon();

  if (!showStatus) {
    return (
      <Button
        onClick={handleSync}
        disabled={isSyncing}
        className={`${className} ${mode === 'auto' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        size="sm"
      >
        {isSyncing ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <StatusIcon className="w-4 h-4 mr-2" />
            {getModeLabel()}
          </>
        )}
      </Button>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <StatusIcon className="w-5 h-5 text-green-600" />
              <span className="font-medium">{getModeLabel()}</span>
            </div>
            
            {lastSync && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                Last sync: {formatLastSync(lastSync)}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              disabled={connectionStatus === 'testing'}
              className="h-8"
            >
              {connectionStatus === 'testing' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : connectionStatus === 'connected' ? (
                <CheckCircle className="w-3 h-3 text-green-600" />
              ) : connectionStatus === 'error' ? (
                <AlertCircle className="w-3 h-3 text-red-600" />
              ) : (
                <Database className="w-3 h-3" />
              )}
            </Button>

            {/* Sync Button */}
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              className={`h-8 ${mode === 'auto' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              size="sm"
            >
              {isSyncing ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <StatusIcon className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {connectionStatus === 'connected' && (
          <div className="mt-2 text-sm text-green-600 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terhubung ke Google Sheets
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="mt-2 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Gagal terhubung ke Google Sheets
          </div>
        )}

        {isSyncing && (
          <div className="mt-2 text-sm text-blue-600 flex items-center">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Sedang mensinkronkan data...
          </div>
        )}

        {lastSync && !isSyncing && connectionStatus === 'connected' && (
          <div className="mt-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              Terakhir sync: {formatLastSync(lastSync)}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SheetSyncButton;
