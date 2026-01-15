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

interface Departemen {
  id_departemen: string;
  kode_departemen: string;
  nama_departemen: string;
}

interface HapusDepartemenProps {
  departemen: Departemen | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const HapusDepartemen: React.FC<HapusDepartemenProps> = ({ 
  departemen, 
  open, 
  onOpenChange,
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!departemen) return;
    
    setIsLoading(true);

    try {
      await api.delete(`/api/departemen/${departemen.id_departemen}`);
      
      toast({
        title: 'Success',
        description: 'Departemen berhasil dihapus',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menghapus departemen';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!departemen) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-100 p-1.5 sm:p-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
            <AlertDialogTitle className="text-base sm:text-lg">Hapus Departemen</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 sm:pt-3 text-xs sm:text-sm">
            Apakah Anda yakin ingin menghapus departemen ini?
            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted rounded-md">
              <div className="text-xs sm:text-sm">
                <span className="font-medium text-foreground">Kode:</span> {departemen.kode_departemen}
              </div>
              <div className="text-xs sm:text-sm mt-1">
                <span className="font-medium text-foreground">Nama:</span> {departemen.nama_departemen}
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

export default HapusDepartemen;