import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface MasterAset {
  id_master_aset: string;
  id_kategori: string;
  id_merek: string;
  id_tipe: string;
  nama_kategori: string;
  nama_merek: string;
  nama_tipe: string;
  umur_ekonomis: number;
  metode_penyusutan: string;
  created_at?: string;
  updated_at?: string;
}

interface ViewMasterAsetProps {
  masterAset: MasterAset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewMasterAset: React.FC<ViewMasterAsetProps> = ({ masterAset, open, onOpenChange }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMetodeDescription = (metode: string) => {
    switch (metode) {
      case 'Straight-Line':
        return 'Metode penyusutan dengan nilai yang sama setiap periode';
      case 'Declining Balance':
        return 'Metode penyusutan dengan nilai menurun setiap periode';
      case 'Sum of Years':
        return 'Metode penyusutan berdasarkan jumlah angka tahun';
      default:
        return metode;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Detail Master Aset</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap tentang master aset
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* ID */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">ID:</span>
              <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-mono break-all">{masterAset?.id_master_aset}</span>
            </div>
          </div>

          <Separator />

          {/* Informasi Aset */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Informasi Aset</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Kategori:</span>
              <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-semibold">{masterAset?.nama_kategori}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Merek:</span>
              <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">{masterAset?.nama_merek}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Tipe:</span>
              <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">{masterAset?.nama_tipe}</span>
            </div>
          </div>

          <Separator />

          {/* Informasi Penyusutan */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Informasi Penyusutan</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Umur Ekonomis:</span>
              <span className="col-span-1 sm:col-span-2">
                <Badge variant="outline" className="text-xs">
                  {masterAset?.umur_ekonomis} tahun
                </Badge>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Metode:</span>
              <span className="col-span-1 sm:col-span-2">
                <Badge variant="secondary" className="text-xs">
                  {masterAset?.metode_penyusutan}
                </Badge>
              </span>
            </div>

            <div className="bg-muted/50 rounded-lg p-2 sm:p-3">
              <p className="text-xs text-muted-foreground">
                {getMetodeDescription(masterAset?.metode_penyusutan || '')}
              </p>
            </div>
          </div>

          {masterAset?.created_at && (
            <>
              <Separator />
              
              {/* Timestamps */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">Created:</span>
                  <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">{formatDate(masterAset.created_at)}</span>
                </div>

                {masterAset.updated_at && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Updated:</span>
                    <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">{formatDate(masterAset.updated_at)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMasterAset;