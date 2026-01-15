import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Departemen {
  id_departemen: string;
  kode_departemen: string;
  nama_departemen: string;
}

interface ViewDepartemenProps {
  departemen: Departemen | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewDepartemen: React.FC<ViewDepartemenProps> = ({ 
  departemen, 
  open, 
  onOpenChange 
}) => {
  if (!departemen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Detail Departemen</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap departemen
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
          <div className="grid gap-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">ID Departemen</Label>
            <div className="text-xs sm:text-sm font-mono bg-muted p-2 sm:p-3 rounded break-all">
              {departemen.id_departemen}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">Kode Departemen</Label>
            <div className="text-xs sm:text-sm font-medium p-2 sm:p-3 border rounded">
              {departemen.kode_departemen}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">Nama Departemen</Label>
            <div className="text-xs sm:text-sm font-medium p-2 sm:p-3 border rounded">
              {departemen.nama_departemen}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDepartemen;