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

interface RiwayatPemakaian {
  id_riwayat: string;
  id_aset: string;
  id_user: string;
  tanggal_mulai_pakai: string;
  tanggal_selesai_pakai: string | null;
  lokasi_pemakaian: string;
  kondisi_aset: string;
  keterangan: string;
  created_at?: string;
  updated_at?: string;
}

interface ViewRiwayatPemakaianProps {
  riwayat: RiwayatPemakaian | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewRiwayatPemakaian: React.FC<ViewRiwayatPemakaianProps> = ({ 
  riwayat, 
  open, 
  onOpenChange 
}) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getKondisiBadge = (kondisi: string) => {
    switch (kondisi.toLowerCase()) {
      case 'baik':
        return <Badge variant="default" className="text-xs">Baik</Badge>;
      case 'rusak ringan':
        return <Badge variant="secondary" className="text-xs">Rusak Ringan</Badge>;
      case 'rusak berat':
        return <Badge variant="destructive" className="text-xs">Rusak Berat</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{kondisi}</Badge>;
    }
  };

  const getStatusPemakaian = () => {
    if (!riwayat?.tanggal_selesai_pakai) {
      return <Badge variant="default" className="text-xs">Sedang Dipakai</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Selesai</Badge>;
  };

  const calculateDuration = () => {
    if (!riwayat) return '-';
    
    const start = new Date(riwayat.tanggal_mulai_pakai);
    const end = riwayat.tanggal_selesai_pakai 
      ? new Date(riwayat.tanggal_selesai_pakai)
      : new Date();
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} hari`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} bulan`;
    } else {
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      return `${years} tahun ${months} bulan`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">Detail Riwayat Pemakaian</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap tentang riwayat pemakaian aset
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Status:</span>
            {getStatusPemakaian()}
          </div>

          <Separator />

          {/* ID Riwayat */}
          <div className="space-y-2">
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">ID Riwayat:</span>
              <span className="text-xs sm:text-sm font-mono break-all sm:col-span-2">{riwayat?.id_riwayat}</span>
            </div>
          </div>

          <Separator />

          {/* Informasi Aset & User */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Informasi Aset & User</h4>
            
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">ID Aset:</span>
              <span className="text-xs sm:text-sm font-mono break-all sm:col-span-2">{riwayat?.id_aset}</span>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">ID User:</span>
              <span className="text-xs sm:text-sm font-mono break-all sm:col-span-2">{riwayat?.id_user}</span>
            </div>
          </div>

          <Separator />

          {/* Periode Pemakaian */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Periode Pemakaian</h4>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Tanggal Mulai:</span>
              <span className="text-xs sm:text-sm font-semibold sm:col-span-2">
                {formatDate(riwayat?.tanggal_mulai_pakai)}
              </span>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Tanggal Selesai:</span>
              <span className="text-xs sm:text-sm sm:col-span-2">
                {formatDate(riwayat?.tanggal_selesai_pakai)}
              </span>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Durasi:</span>
              <span className="sm:col-span-2">
                <Badge variant="outline" className="text-xs">{calculateDuration()}</Badge>
              </span>
            </div>
          </div>

          <Separator />

          {/* Detail Pemakaian */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Detail Pemakaian</h4>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Lokasi:</span>
              <span className="text-xs sm:text-sm sm:col-span-2">{riwayat?.lokasi_pemakaian}</span>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Kondisi Aset:</span>
              <span className="sm:col-span-2">
                {riwayat && getKondisiBadge(riwayat.kondisi_aset)}
              </span>
            </div>

            {riwayat?.keterangan && (
              <div className="grid gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Keterangan:</span>
                <div className="bg-muted/50 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm">{riwayat.keterangan}</p>
                </div>
              </div>
            )}
          </div>

          {riwayat?.created_at && (
            <>
              <Separator />
              
              {/* Timestamps */}
              <div className="space-y-2">
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">Created:</span>
                  <span className="text-xs sm:text-sm sm:col-span-2">{formatDateTime(riwayat.created_at)}</span>
                </div>

                {riwayat.updated_at && (
                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Updated:</span>
                    <span className="text-xs sm:text-sm sm:col-span-2">{formatDateTime(riwayat.updated_at)}</span>
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

export default ViewRiwayatPemakaian;