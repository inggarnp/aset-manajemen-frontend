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

interface PenyusutanAset {
  id_penyusutan: string;
  id_aset: string;
  periode_penyusutan: string;
  nilai_penyusutan: number;
  nilai_buku: number;
  akumulasi_penyusutan: number;
  tanggal_perhitungan: string;
}

interface HapusPenyusutanAsetProps {
  penyusutan: PenyusutanAset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const HapusPenyusutanAset: React.FC<HapusPenyusutanAsetProps> = ({ 
  penyusutan, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!penyusutan) return;

    setIsLoading(true);

    try {
      await api.delete(`/api/penyusutan-aset/${penyusutan.id_penyusutan}`);
      
      toast({
        title: 'Success',
        description: 'Penyusutan aset berhasil dihapus',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal menghapus penyusutan aset';
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
      <AlertDialogContent className="w-[95vw] max-w-[500px] p-4 sm:p-6">
        <AlertDialogHeader className="space-y-2 sm:space-y-3">
          <AlertDialogTitle className="text-lg sm:text-xl">Hapus Penyusutan Aset</AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm space-y-3 sm:space-y-4">
            <p>Apakah Anda yakin ingin menghapus data penyusutan ini?</p>
            
            <div className="space-y-2 text-xs sm:text-sm bg-muted p-3 rounded-md">
              {/* Periode & Tanggal */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-medium">Periode:</span>
                <strong className="break-words">{penyusutan?.periode_penyusutan}</strong>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="font-medium">Tanggal:</span>
                <span className="break-words">
                  {penyusutan?.tanggal_perhitungan && formatDate(penyusutan.tanggal_perhitungan)}
                </span>
              </div>
              
              {/* Financial Info */}
              <div className="pt-2 border-t border-border space-y-1">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span>Nilai Penyusutan:</span>
                  <span className="font-semibold text-red-600 break-words">
                    {penyusutan?.nilai_penyusutan && formatCurrency(penyusutan.nilai_penyusutan)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span>Nilai Buku:</span>
                  <span className="font-semibold text-blue-600 break-words">
                    {penyusutan?.nilai_buku && formatCurrency(penyusutan.nilai_buku)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span>Akumulasi:</span>
                  <span className="font-semibold text-orange-600 break-words">
                    {penyusutan?.akumulasi_penyusutan && formatCurrency(penyusutan.akumulasi_penyusutan)}
                  </span>
                </div>
              </div>
              
              {/* ID */}
              <div className="text-[10px] sm:text-xs mt-2 pt-2 border-t border-border">
                <code className="bg-background px-1 rounded break-all">{penyusutan?.id_penyusutan}</code>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-destructive font-semibold text-xs sm:text-sm">
                Perhatian: Tindakan ini tidak dapat dibatalkan!
              </p>
              <p className="text-[10px] sm:text-xs">
                Data perhitungan penyusutan untuk periode ini akan dihapus secara permanen.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 flex-col-reverse sm:flex-row">
          <AlertDialogCancel disabled={isLoading} className="w-full sm:w-auto">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
          >
            {isLoading ? 'Menghapus...' : 'Hapus Data'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HapusPenyusutanAset;