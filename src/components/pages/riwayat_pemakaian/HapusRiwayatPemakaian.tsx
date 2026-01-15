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

interface RiwayatPemakaian {
  id_riwayat: string;
  id_aset: string;
  id_user: string;
  lokasi_pemakaian: string;
  tanggal_mulai_pakai: string;
  tanggal_selesai_pakai: string | null;
}

interface HapusRiwayatPemakaianProps {
  riwayat: RiwayatPemakaian | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const HapusRiwayatPemakaian: React.FC<HapusRiwayatPemakaianProps> = ({ 
  riwayat, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!riwayat) return;

    setIsLoading(true);

    try {
      await api.delete(`/api/riwayat-pemakaian/${riwayat.id_riwayat}`);
      
      toast({
        title: 'Success',
        description: 'Riwayat pemakaian berhasil dihapus',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal menghapus riwayat pemakaian';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[95vw] max-w-[500px] p-4 sm:p-6">
        <AlertDialogHeader className="space-y-2 sm:space-y-3">
          <AlertDialogTitle className="text-lg sm:text-xl">Hapus Riwayat Pemakaian</AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm space-y-3 sm:space-y-4">
            <p>Apakah Anda yakin ingin menghapus riwayat pemakaian berikut?</p>
            
            <div className="space-y-2 text-xs sm:text-sm bg-muted/50 p-3 rounded-lg">
              {/* ID Riwayat */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="font-medium min-w-[100px]">ID Riwayat:</span>
                <span className="font-mono text-[10px] sm:text-xs break-all flex-1">{riwayat?.id_riwayat}</span>
              </div>
              
              {/* ID Aset */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="font-medium min-w-[100px]">ID Aset:</span>
                <span className="font-mono text-[10px] sm:text-xs break-all flex-1">{riwayat?.id_aset}</span>
              </div>
              
              {/* ID User */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="font-medium min-w-[100px]">ID User:</span>
                <span className="font-mono text-[10px] sm:text-xs break-all flex-1">{riwayat?.id_user}</span>
              </div>
              
              {/* Lokasi */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="font-medium min-w-[100px]">Lokasi:</span>
                <span className="flex-1">{riwayat?.lokasi_pemakaian}</span>
              </div>
              
              {/* Periode */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="font-medium min-w-[100px]">Periode:</span>
                <span className="flex-1 break-words">
                  {formatDate(riwayat?.tanggal_mulai_pakai || null)} - {formatDate(riwayat?.tanggal_selesai_pakai || null)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-destructive font-semibold text-xs sm:text-sm">
                Perhatian: Tindakan ini tidak dapat dibatalkan!
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Data riwayat pemakaian ini akan dihapus secara permanen dari sistem.
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
            {isLoading ? 'Menghapus...' : 'Hapus Riwayat'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HapusRiwayatPemakaian;