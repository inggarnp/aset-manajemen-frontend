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

interface MasterKategoriAset {
  id_kategori: string;
  nama_kategori: string;
  keterangan: string;
}

interface HapusMasterKategoriAsetProps {
  kategori: MasterKategoriAset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const HapusMasterKategoriAset: React.FC<HapusMasterKategoriAsetProps> = ({ 
  kategori, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!kategori) return;

    setIsLoading(true);

    try {
      await api.delete(`/api/master-kategori-aset/${kategori.id_kategori}`);
      
      toast({
        title: 'Success',
        description: 'Master kategori aset berhasil dihapus',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal menghapus master kategori';
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
          <AlertDialogTitle className="text-base sm:text-lg">
            Hapus Master Kategori Aset
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm space-y-2 sm:space-y-3">
            <p>Apakah Anda yakin ingin menghapus kategori aset berikut?</p>
            
            <div className="space-y-1 text-xs sm:text-sm bg-muted/50 p-2 sm:p-3 rounded-lg">
              <div>
                <strong>Nama Kategori:</strong> {kategori?.nama_kategori}
              </div>
              {kategori?.keterangan && (
                <div>
                  <strong>Keterangan:</strong> {kategori.keterangan}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
                ID: <code className="bg-muted px-1.5 py-0.5 rounded">
                  {kategori?.id_kategori}
                </code>
              </div>
            </div>
            
            <p className="text-destructive font-semibold text-xs sm:text-sm">
              Perhatian: Tindakan ini tidak dapat dibatalkan!
            </p>
            
            <p className="text-xs text-muted-foreground">
              Semua master aset yang menggunakan kategori ini mungkin akan terpengaruh.
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
            {isLoading ? 'Menghapus...' : 'Hapus Kategori'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HapusMasterKategoriAset;