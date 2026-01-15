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

interface PenyusutanAset {
  id_penyusutan: string;
  id_aset: string;
  id_keuangan: string;
  periode_penyusutan: string;
  nilai_penyusutan: number;
  nilai_buku: number;
  akumulasi_penyusutan: number;
  tanggal_perhitungan: string;
  created_at: string;
  updated_at: string;
}

interface ViewPenyusutanAsetProps {
  penyusutan: PenyusutanAset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewPenyusutanAset: React.FC<ViewPenyusutanAsetProps> = ({ 
  penyusutan, 
  open, 
  onOpenChange 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [asetName, setAsetName] = useState('');
  const [keuanganName, setKeuanganName] = useState('');

  useEffect(() => {
    if (penyusutan && open) {
      fetchDetails();
    }
  }, [penyusutan, open]);

  const fetchDetails = async () => {
    if (!penyusutan) return;

    setIsLoading(true);
    try {
      const [asetRes, keuanganRes] = await Promise.all([
        api.get('/api/aset'),
        api.get('/api/keuangan-penyusutan'),
      ]);

      const asetData = Array.isArray(asetRes.data) ? asetRes.data : [];
      const keuanganData = Array.isArray(keuanganRes.data) ? keuanganRes.data : [];

      const aset = asetData.find((a: any) => a.id_aset === penyusutan.id_aset);
      const keuangan = keuanganData.find((k: any) => k.id_keuangan === penyusutan.id_keuangan);

      setAsetName(aset ? `${aset.kode_aset} - ${aset.nama_aset}` : 'Unknown');
      setKeuanganName(keuangan ? `${keuangan.kode_akun} - ${keuangan.nama_akun}` : 'Unknown');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Gagal memuat detail',
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">Detail Penyusutan Aset</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap perhitungan penyusutan
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Basic Info */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Informasi Dasar</h4>
              
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">ID:</span>
                <span className="text-xs sm:text-sm font-mono break-all sm:col-span-2">{penyusutan?.id_penyusutan}</span>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Aset:</span>
                <span className="text-xs sm:text-sm sm:col-span-2 break-words">{asetName}</span>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Akun Keuangan:</span>
                <span className="sm:col-span-2">
                  <Badge variant="outline" className="text-xs break-words max-w-full">{keuanganName}</Badge>
                </span>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Periode:</span>
                <span className="sm:col-span-2">
                  <Badge className="text-xs">{penyusutan?.periode_penyusutan}</Badge>
                </span>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Tanggal:</span>
                <span className="text-xs sm:text-sm sm:col-span-2">
                  {penyusutan?.tanggal_perhitungan && formatDate(penyusutan.tanggal_perhitungan)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Financial Info */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Informasi Keuangan</h4>

              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Nilai Penyusutan:</span>
                <span className="text-xs sm:text-sm font-semibold text-red-600 sm:col-span-2 break-words">
                  {penyusutan?.nilai_penyusutan && formatCurrency(penyusutan.nilai_penyusutan)}
                </span>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Nilai Buku:</span>
                <span className="text-xs sm:text-sm font-semibold text-blue-600 sm:col-span-2 break-words">
                  {penyusutan?.nilai_buku && formatCurrency(penyusutan.nilai_buku)}
                </span>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Akumulasi:</span>
                <span className="text-xs sm:text-sm font-semibold text-orange-600 sm:col-span-2 break-words">
                  {penyusutan?.akumulasi_penyusutan && formatCurrency(penyusutan.akumulasi_penyusutan)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Summary Card */}
            <div className="bg-muted p-3 sm:p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-xs sm:text-sm">Ringkasan</h4>
              <div className="text-[10px] sm:text-xs text-muted-foreground space-y-1">
                <div className="break-words">
                  Penurunan nilai per periode: <strong className="text-red-600">{penyusutan?.nilai_penyusutan && formatCurrency(penyusutan.nilai_penyusutan)}</strong>
                </div>
                <div className="break-words">
                  Nilai tercatat saat ini: <strong className="text-blue-600">{penyusutan?.nilai_buku && formatCurrency(penyusutan.nilai_buku)}</strong>
                </div>
                <div className="break-words">
                  Total penyusutan s/d periode ini: <strong className="text-orange-600">{penyusutan?.akumulasi_penyusutan && formatCurrency(penyusutan.akumulasi_penyusutan)}</strong>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="space-y-2">
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Created:</span>
                <span className="text-xs sm:text-sm sm:col-span-2">
                  {penyusutan?.created_at && formatDateTime(penyusutan.created_at)}
                </span>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Updated:</span>
                <span className="text-xs sm:text-sm sm:col-span-2">
                  {penyusutan?.updated_at && formatDateTime(penyusutan.updated_at)}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewPenyusutanAset;