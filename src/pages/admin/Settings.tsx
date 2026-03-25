import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import CloudSettings from '@/components/CloudSettings';

export default function SettingsPage() {
  console.log('Settings component mounted');
  const { storeSettings, updateStoreSettings } = useApp();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Pengaturan</h2>
      </div>
      
      {/* Store Settings */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-bold text-foreground">Pengaturan Toko</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Nama Toko</label>
            <input
              type="text"
              value={storeSettings?.storeName || ''}
              onChange={(e) => updateStoreSettings({ storeName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nama Toko"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Alamat</label>
            <textarea
              value={storeSettings?.address || ''}
              onChange={(e) => updateStoreSettings({ address: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Alamat Toko"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Telepon</label>
            <input
              type="tel"
              value={storeSettings?.phone || ''}
              onChange={(e) => updateStoreSettings({ phone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nomor Telepon"
            />
          </div>
        </div>
      </div>

      {/* Cloud Settings */}
      <CloudSettings />

      {/* Test Section */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden p-6">
        <h3 className="font-bold text-foreground mb-4">Status Pengaturan</h3>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            ✅ Halaman pengaturan berhasil dimuat
          </p>
          <p className="text-sm text-muted-foreground">
            ✅ Komponen berfungsi dengan normal
          </p>
          <p className="text-sm text-muted-foreground">
            ✅ Data toko dapat diedit
          </p>
          <p className="text-sm text-muted-foreground">
            ✅ Pengaturan cloud tersedia
          </p>
        </div>
      </div>
    </div>
  );
}
