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
  DialogTrigger,
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
import { Plus } from 'lucide-react';

interface TambahPenyusutanAsetProps {
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

const TambahPenyusutanAset: React.FC<TambahPenyusutanAsetProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
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
    if (open) {
      fetchDropdownData();
    }
  }, [open]);

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

      await api.post('/api/penyusutan-aset', payload);
      
      toast({
        title: 'Success',
        description: 'Penyusutan aset berhasil ditambahkan',
      });

      setFormData({
        id_aset: '',
        id_keuangan: '',
        periode_penyusutan: '',
        nilai_penyusutan: '',
        nilai_buku: '',
        akumulasi_penyusutan: '',
        tanggal_perhitungan: '',
      });
      
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal menambahkan penyusutan aset';
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Tambah Penyusutan</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="text-lg sm:text-xl">Tambah Penyusutan Aset</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Tambahkan perhitungan penyusutan aset baru
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
                  <SelectValue placeholder="Pilih aset" />
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
                  <SelectValue placeholder="Pilih akun keuangan" />
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
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Pilih akun untuk mencatat penyusutan
              </p>
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
                  placeholder="2024-Q1"
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
                  placeholder="500000"
                  required
                  min="0"
                  className="text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  Per periode
                </p>
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
                  placeholder="14500000"
                  required
                  min="0"
                  className="text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  Saat ini
                </p>
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
                  placeholder="1500000"
                  required
                  min="0"
                  className="text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                  Total s/d saat ini
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-2 sm:p-3">
              <p className="text-[10px] sm:text-xs text-blue-800 dark:text-blue-200">
                <strong>Tips:</strong> Nilai Buku = Harga Perolehan - Akumulasi Penyusutan
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Menyimpan...' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahPenyusutanAset;