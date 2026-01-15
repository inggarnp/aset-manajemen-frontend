import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface PenyusutanAset {
  id_penyusutan: string;
  id_aset: string;
  id_keuangan: string;
  periode_penyusutan: string;
  nilai_penyusutan: number;
  nilai_buku: number;
  akumulasi_penyusutan: number;
  tanggal_perhitungan: string;
}

interface EditPenyusutanAsetProps {
  penyusutan: PenyusutanAset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Aset {
  id_aset: string;
  kode_aset: string;
  nama_aset: string;
}

interface KeuanganPenyusutan {
  id_keuangan: string;
  nama_akun: string;
  kode_akun: string;
  jenis_akun: string;
}

const EditPenyusutanAset: React.FC<EditPenyusutanAsetProps> = ({ 
  penyusutan, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [asetList, setAsetList] = useState<Aset[]>([]);
  const [keuanganList, setKeuanganList] = useState<KeuanganPenyusutan[]>([]);
  
  const [formData, setFormData] = useState({
    id_aset: '',
    id_keuangan: '',
    periode_penyusutan: '',
    nilai_penyusutan: '',
    nilai_buku: '',
    akumulasi_penyusutan: '',
    tanggal_perhitungan: '',
  });

  useEffect(() => {
    if (penyusutan && open) {
      setFormData({
        id_aset: penyusutan.id_aset,
        id_keuangan: penyusutan.id_keuangan,
        periode_penyusutan: penyusutan.periode_penyusutan,
        nilai_penyusutan: penyusutan.nilai_penyusutan.toString(),
        nilai_buku: penyusutan.nilai_buku.toString(),
        akumulasi_penyusutan: penyusutan.akumulasi_penyusutan.toString(),
        tanggal_perhitungan: penyusutan.tanggal_perhitungan,
      });
      fetchDropdownData();
    }
  }, [penyusutan, open]);

  const fetchDropdownData = async () => {
    try {
      const [asetRes, keuanganRes] = await Promise.all([
        api.get('/api/aset'),
        api.get('/api/keuangan-penyusutan'),
      ]);

      setAsetList(Array.isArray(asetRes.data) ? asetRes.data : []);
      setKeuanganList(Array.isArray(keuanganRes.data) ? keuanganRes.data : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data',
        variant: 'destructive',
      });
      setAsetList([]);
      setKeuanganList([]);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!penyusutan) return;

    setIsLoading(true);

    try {
      const payload = {
        id_aset: formData.id_aset,
        id_keuangan: formData.id_keuangan,
        periode_penyusutan: formData.periode_penyusutan,
        nilai_penyusutan: parseFloat(formData.nilai_penyusutan),
        nilai_buku: parseFloat(formData.nilai_buku),
        akumulasi_penyusutan: parseFloat(formData.akumulasi_penyusutan),
        tanggal_perhitungan: formData.tanggal_perhitungan,
      };

      await api.put(`/api/penyusutan-aset/${penyusutan.id_penyusutan}`, payload);
      
      toast({
        title: 'Success',
        description: 'Penyusutan aset berhasil diupdate',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal mengupdate penyusutan aset';
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="text-lg sm:text-xl">Edit Penyusutan Aset</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update perhitungan penyusutan aset
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Aset */}
            <div className="grid gap-2">
              <Label htmlFor="id_aset" className="text-sm">
                Aset <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.id_aset}
                onValueChange={(value) => handleChange('id_aset', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {asetList.map((aset) => (
                    <SelectItem key={aset.id_aset} value={aset.id_aset} className="text-sm">
                      <span className="hidden sm:inline">{aset.kode_aset} - {aset.nama_aset}</span>
                      <span className="sm:hidden">{aset.nama_aset}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Akun Keuangan */}
            <div className="grid gap-2">
              <Label htmlFor="id_keuangan" className="text-sm">
                Akun Keuangan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.id_keuangan}
                onValueChange={(value) => handleChange('id_keuangan', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {keuanganList.map((keuangan) => (
                    <SelectItem key={keuangan.id_keuangan} value={keuangan.id_keuangan} className="text-sm">
                      <span className="hidden sm:inline">{keuangan.kode_akun} - {keuangan.nama_akun}</span>
                      <span className="sm:hidden">{keuangan.nama_akun}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Periode & Tanggal - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Periode Penyusutan */}
              <div className="grid gap-2">
                <Label htmlFor="periode_penyusutan" className="text-sm">
                  Periode <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="periode_penyusutan"
                  value={formData.periode_penyusutan}
                  onChange={(e) => handleChange('periode_penyusutan', e.target.value)}
                  required
                  className="text-sm"
                />
              </div>

              {/* Tanggal Perhitungan */}
              <div className="grid gap-2">
                <Label htmlFor="tanggal_perhitungan" className="text-sm">
                  Tanggal <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tanggal_perhitungan"
                  type="date"
                  value={formData.tanggal_perhitungan}
                  onChange={(e) => handleChange('tanggal_perhitungan', e.target.value)}
                  required
                  className="text-sm"
                />
              </div>
            </div>

            {/* Nilai Fields - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Nilai Penyusutan */}
              <div className="grid gap-2">
                <Label htmlFor="nilai_penyusutan" className="text-sm">
                  Nilai Penyusutan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nilai_penyusutan"
                  type="number"
                  step="0.01"
                  value={formData.nilai_penyusutan}
                  onChange={(e) => handleChange('nilai_penyusutan', e.target.value)}
                  required
                  min="0"
                  className="text-sm"
                />
              </div>

              {/* Nilai Buku */}
              <div className="grid gap-2">
                <Label htmlFor="nilai_buku" className="text-sm">
                  Nilai Buku <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nilai_buku"
                  type="number"
                  step="0.01"
                  value={formData.nilai_buku}
                  onChange={(e) => handleChange('nilai_buku', e.target.value)}
                  required
                  min="0"
                  className="text-sm"
                />
              </div>

              {/* Akumulasi Penyusutan */}
              <div className="grid gap-2">
                <Label htmlFor="akumulasi_penyusutan" className="text-sm">
                  Akumulasi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="akumulasi_penyusutan"
                  type="number"
                  step="0.01"
                  value={formData.akumulasi_penyusutan}
                  onChange={(e) => handleChange('akumulasi_penyusutan', e.target.value)}
                  required
                  min="0"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Menyimpan...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPenyusutanAset;