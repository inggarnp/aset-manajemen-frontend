import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Jabatan {
  id_jabatan: string;
  kode_jabatan: string;
  nama_jabatan: string;
}

interface ViewJabatanProps {
  jabatan: Jabatan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewJabatan: React.FC<ViewJabatanProps> = ({ 
  jabatan, 
  open, 
  onOpenChange 
}) => {
  if (!jabatan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Detail Jabatan</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap jabatan
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
          <div className="grid gap-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">ID Jabatan</Label>
            <div className="text-xs sm:text-sm font-mono bg-muted p-2 sm:p-3 rounded break-all">
              {jabatan.id_jabatan}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">Kode Jabatan</Label>
            <div className="text-xs sm:text-sm font-medium p-2 sm:p-3 border rounded">
              {jabatan.kode_jabatan}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">Nama Jabatan</Label>
            <div className="text-xs sm:text-sm font-medium p-2 sm:p-3 border rounded">
              {jabatan.nama_jabatan}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewJabatan;