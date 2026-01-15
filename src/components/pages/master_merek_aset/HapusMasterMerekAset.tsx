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

interface MasterMerekAset {
  id_merek: string;
  nama_merek: string;
  keterangan: string;
}

interface HapusMasterMerekAsetProps {
  merek: MasterMerekAset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const HapusMasterMerekAset: React.FC<HapusMasterMerekAsetProps> = ({ 
  merek, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!merek) return;

    setIsLoading(true);

    try {
      await api.delete(`/api/master-merek-aset/${merek.id_merek}`);
      
      toast({
        title: 'Success',
        description: 'Master merek aset berhasil dihapus',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal menghapus master merek';
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
            Hapus Master Merek Aset
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm space-y-2 sm:space-y-3">
            <p>Apakah Anda yakin ingin menghapus merek aset berikut?</p>
            
            <div className="space-y-1 text-xs sm:text-sm bg-muted/50 p-2 sm:p-3 rounded-lg">
              <div>
                <strong>Nama Merek:</strong> {merek?.nama_merek}
              </div>
              {merek?.keterangan && (
                <div>
                  <strong>Keterangan:</strong> {merek.keterangan}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
                ID: <code className="bg-muted px-1.5 py-0.5 rounded">
                  {merek?.id_merek}
                </code>
              </div>
            </div>
            
            <p className="text-destructive font-semibold text-xs sm:text-sm">
              Perhatian: Tindakan ini tidak dapat dibatalkan!
            </p>
            
            <p className="text-xs text-muted-foreground">
              Semua master aset yang menggunakan merek ini mungkin akan terpengaruh.
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
            {isLoading ? 'Menghapus...' : 'Hapus Merek'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HapusMasterMerekAset;