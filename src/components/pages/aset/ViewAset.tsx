import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Aset {
  id_aset: string;
  kode_aset: string;
  nama_aset: string;
  serial_number: string;
  tanggal_pembelian: string;
  harga_beli: number;
  id_master_aset: string;
  status_aset: string;
  aksesoris?: string;
  created_at: string;
  updated_at: string;
}

interface ViewAsetProps {
  aset: Aset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewAset: React.FC<ViewAsetProps> = ({ aset, open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [masterAsetName, setMasterAsetName] = useState('');

  useEffect(() => {
    if (aset && open) {
      fetchMasterAset();
    }
  }, [aset, open]);

  const fetchMasterAset = async () => {
    if (!aset) return;

    setIsLoading(true);
    try {
      const response = await api.get('/api/master-aset');
      const master = response.data.find(
        (m: any) => m.id_master_aset === aset.id_master_aset
      );
      setMasterAsetName(master?.kategori_aset || 'Unknown');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Gagal memuat detail master aset',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      tersedia: 'default',
      digunakan: 'secondary',
      rusak: 'destructive',
      maintenance: 'outline',
    };

    return (
      <Badge variant={variants[status.toLowerCase()] || 'default'} className="text-xs">
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Detail Aset</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap tentang aset
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Basic Info */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Informasi Dasar</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">ID Aset:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-mono break-all">{aset?.id_aset}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Kode Aset:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-semibold">{aset?.kode_aset}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Nama Aset:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-semibold">{aset?.nama_aset}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Serial Number:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-mono break-all">{aset?.serial_number}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Kategori:</span>
                <span className="col-span-1 sm:col-span-2">
                  <Badge variant="outline" className="text-xs">{masterAsetName}</Badge>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Status:</span>
                <span className="col-span-1 sm:col-span-2">
                  {aset && getStatusBadge(aset.status_aset)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Purchase Info */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Informasi Pembelian</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Tanggal Beli:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">
                  {aset?.tanggal_pembelian && formatDate(aset.tanggal_pembelian)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Harga Beli:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-semibold text-green-600 break-all">
                  {aset?.harga_beli && formatCurrency(aset.harga_beli)}
                </span>
              </div>
            </div>

            {/* Aksesoris - NEW SECTION */}
            {aset?.aksesoris && (
              <>
                <Separator />
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Aksesoris & Kelengkapan</h4>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs sm:text-sm whitespace-pre-wrap">{aset.aksesoris}</p>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Timestamps */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Created:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">
                  {aset?.created_at && formatDateTime(aset.created_at)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Updated:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">
                  {aset?.updated_at && formatDateTime(aset.updated_at)}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewAset;