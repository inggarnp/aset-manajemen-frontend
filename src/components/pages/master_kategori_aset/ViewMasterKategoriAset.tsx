import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface MasterKategoriAset {
  id_kategori: string;
  nama_kategori: string;
  keterangan: string;
  created_at?: string;
  updated_at?: string;
}

interface ViewMasterKategoriAsetProps {
  kategori: MasterKategoriAset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewMasterKategoriAset: React.FC<ViewMasterKategoriAsetProps> = ({ 
  kategori, 
  open, 
  onOpenChange 
}) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Detail Master Kategori Aset</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap tentang kategori aset
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* ID */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">ID:</span>
              <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-mono break-all">
                {kategori?.id_kategori}
              </span>
            </div>
          </div>

          <Separator />

          {/* Informasi Kategori */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">
              Informasi Kategori
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Nama Kategori:
              </span>
              <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-semibold">
                {kategori?.nama_kategori}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Keterangan:
              </span>
              <div className="bg-muted/50 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">
                  {kategori?.keterangan || 'Tidak ada keterangan'}
                </p>
              </div>
            </div>
          </div>

          {kategori?.created_at && (
            <>
              <Separator />
              
              {/* Timestamps */}
              <div className="space-y-2">
                <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">
                  Informasi Waktu
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Created:
                  </span>
                  <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">
                    {formatDate(kategori.created_at)}
                  </span>
                </div>

                {kategori.updated_at && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Updated:
                    </span>
                    <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">
                      {formatDate(kategori.updated_at)}
                    </span>
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

export default ViewMasterKategoriAset;