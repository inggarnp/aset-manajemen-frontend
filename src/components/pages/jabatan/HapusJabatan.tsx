import React, { useState } from 'react';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

interface Jabatan {
  id_jabatan: string;
  kode_jabatan: string;
  nama_jabatan: string;
  deskripsi?: string;
}

interface HapusJabatanProps {
  jabatan: Jabatan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const HapusJabatan: React.FC<HapusJabatanProps> = ({ 
  jabatan, 
  open, 
  onOpenChange,
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!jabatan) return;
    
    setIsLoading(true);

    try {
      await api.delete(`/api/jabatan/${jabatan.id_jabatan}`);
      
      toast({
        title: 'Success',
        description: 'Jabatan berhasil dihapus',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menghapus jabatan';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!jabatan) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-100 p-1.5 sm:p-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-base sm:text-lg">Hapus Jabatan</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 sm:pt-3 text-xs sm:text-sm">
            Apakah Anda yakin ingin menghapus jabatan ini?
            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted rounded-md">
              <div className="text-xs sm:text-sm">
                <span className="font-medium text-foreground">Kode:</span> {jabatan.kode_jabatan}
              </div>
              <div className="text-xs sm:text-sm mt-1">
                <span className="font-medium text-foreground">Nama:</span> {jabatan.nama_jabatan}
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-red-600 font-medium text-xs sm:text-sm">
              Tindakan ini tidak dapat dibatalkan!
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HapusJabatan;