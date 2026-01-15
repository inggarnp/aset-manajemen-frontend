import React, { useState } from 'react';
import api from '@/api/axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface Aset {
  id_aset: string;
  kode_aset: string;
  nama_aset: string;
  serial_number: string;
  harga_beli: number;
}

interface HapusAsetProps {
  aset: Aset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const HapusAset: React.FC<HapusAsetProps> = ({ aset, open, onOpenChange, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async () => {
    if (!aset) return;

    setIsLoading(true);

    try {
      await api.delete(`/api/aset/${aset.id_aset}`);
      
      toast({
        title: 'Success',
        description: 'Aset berhasil dihapus',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal menghapus aset';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base sm:text-lg">Hapus Aset</AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm space-y-2 sm:space-y-3">
            <p>
              Apakah Anda yakin ingin menghapus aset <strong className="text-foreground">{aset?.nama_aset}</strong>?
            </p>
            
            <div className="space-y-1 text-xs sm:text-sm bg-muted p-2 sm:p-3 rounded-md">
              <div>
                <span className="font-medium">Kode:</span> {aset?.kode_aset}
              </div>
              <div>
                <span className="font-medium">Serial:</span> <span className="font-mono">{aset?.serial_number}</span>
              </div>
              <div>
                <span className="font-medium">Harga:</span>{' '}
                <span className="break-all">{aset?.harga_beli && formatCurrency(aset.harga_beli)}</span>
              </div>
              <div className="text-xs mt-2 pt-2 border-t border-muted">
                <code className="bg-background px-1.5 py-0.5 rounded break-all">{aset?.id_aset}</code>
              </div>
            </div>
            
            <p className="text-destructive font-semibold text-xs sm:text-sm">
              ⚠️ Perhatian: Tindakan ini tidak dapat dibatalkan!
            </p>
            
            <p className="text-xs text-muted-foreground">
              Semua data terkait aset ini, termasuk riwayat pemakaian, akan dihapus secara permanen.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel 
            disabled={isLoading}
            className="w-full sm:w-auto order-2 sm:order-1 mt-0"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto order-1 sm:order-2 bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? 'Menghapus...' : 'Hapus Aset'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HapusAset;