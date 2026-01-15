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

interface MasterAset {
  id_master_aset: string;
  nama_kategori: string;
  nama_merek: string;
  nama_tipe: string;
}

interface HapusMasterAsetProps {
  masterAset: MasterAset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const HapusMasterAset: React.FC<HapusMasterAsetProps> = ({ masterAset, open, onOpenChange, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!masterAset) return;

    setIsLoading(true);

    try {
      await api.delete(`/api/master-aset/${masterAset.id_master_aset}`);
      
      toast({
        title: 'Success',
        description: 'Master aset berhasil dihapus',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal menghapus master aset';
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
          <AlertDialogTitle className="text-base sm:text-lg">Hapus Master Aset</AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm space-y-2 sm:space-y-3">
            <p>Apakah Anda yakin ingin menghapus master aset berikut?</p>
            
            <div className="space-y-1 text-xs sm:text-sm bg-muted/50 p-2 sm:p-3 rounded-lg">
              <div>
                <strong>Kategori:</strong> {masterAset?.nama_kategori}
              </div>
              <div>
                <strong>Merek:</strong> {masterAset?.nama_merek}
              </div>
              <div>
                <strong>Tipe:</strong> {masterAset?.nama_tipe}
              </div>
              <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
                ID: <code className="bg-muted px-1.5 py-0.5 rounded">{masterAset?.id_master_aset}</code>
              </div>
            </div>
            
            <p className="text-destructive font-semibold text-xs sm:text-sm">
              Perhatian: Tindakan ini tidak dapat dibatalkan!
            </p>
            
            <p className="text-xs text-muted-foreground">
              Semua aset yang menggunakan master aset ini mungkin akan terpengaruh.
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
            {isLoading ? 'Menghapus...' : 'Hapus Master Aset'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HapusMasterAset;