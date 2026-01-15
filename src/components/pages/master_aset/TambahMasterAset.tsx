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

interface TambahMasterAsetProps {
  onSuccess: () => void;
}

interface FormData {
  id_kategori: string;
  id_merek: string;
  id_tipe: string;
  umur_ekonomis: string;
  metode_penyusutan: string;
}

interface MasterData {
  id_kategori?: string;
  id_merek?: string;
  id_tipe?: string;
  nama_kategori?: string;
  nama_merek?: string;
  nama_tipe?: string;
}

const METODE_PENYUSUTAN_OPTIONS = [
  { value: 'Straight-Line', label: 'Straight-Line (Garis Lurus)' },
  { value: 'Declining Balance', label: 'Declining Balance (Saldo Menurun)' },
  { value: 'Sum of Years', label: 'Sum of Years (Jumlah Angka Tahun)' },
];

const TambahMasterAset: React.FC<TambahMasterAsetProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMaster, setIsLoadingMaster] = useState(false);

  const [kategoriList, setKategoriList] = useState<MasterData[]>([]);
  const [merekList, setMerekList] = useState<MasterData[]>([]);
  const [tipeList, setTipeList] = useState<MasterData[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    id_kategori: '',
    id_merek: '',
    id_tipe: '',
    umur_ekonomis: '',
    metode_penyusutan: '',
  });

  useEffect(() => {
    if (open) {
      fetchMasterData();
    }
  }, [open]);

  const fetchMasterData = async () => {
    setIsLoadingMaster(true);
    try {
      const [kategoriRes, merekRes, tipeRes] = await Promise.all([
        api.get('/api/master-kategori-aset'),
        api.get('/api/master-merek-aset'),
        api.get('/api/master-tipe-aset'),
      ]);

      setKategoriList(Array.isArray(kategoriRes.data) ? kategoriRes.data : []);
      setMerekList(Array.isArray(merekRes.data) ? merekRes.data : []);
      setTipeList(Array.isArray(tipeRes.data) ? tipeRes.data : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data master',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMaster(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.id_kategori) {
      toast({
        title: 'Validation Error',
        description: 'Kategori aset harus dipilih',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.id_merek) {
      toast({
        title: 'Validation Error',
        description: 'Merek aset harus dipilih',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.id_tipe) {
      toast({
        title: 'Validation Error',
        description: 'Tipe aset harus dipilih',
        variant: 'destructive',
      });
      return false;
    }

    const umur = parseInt(formData.umur_ekonomis);
    if (isNaN(umur) || umur < 1) {
      toast({
        title: 'Validation Error',
        description: 'Umur ekonomis harus berupa angka positif',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.metode_penyusutan) {
      toast({
        title: 'Validation Error',
        description: 'Metode penyusutan harus dipilih',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      const payload = {
        id_kategori: formData.id_kategori,
        id_merek: formData.id_merek,
        id_tipe: formData.id_tipe,
        umur_ekonomis: parseInt(formData.umur_ekonomis),
        metode_penyusutan: formData.metode_penyusutan,
      };

      await api.post('/api/master-aset', payload);

      toast({
        title: 'Success',
        description: 'Master aset berhasil ditambahkan',
      });

      setFormData({
        id_kategori: '',
        id_merek: '',
        id_tipe: '',
        umur_ekonomis: '',
        metode_penyusutan: '',
      });

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create master aset';
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
          <span className="hidden sm:inline">Tambah Master Aset</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Tambah Master Aset Baru</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Isi form di bawah untuk menambahkan master aset baru
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Kategori & Merek - 2 kolom di desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="id_kategori" className="text-sm">
                  Kategori Aset <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.id_kategori}
                  onValueChange={(value) => handleInputChange('id_kategori', value)}
                  disabled={isLoading || isLoadingMaster}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriList.map((kategori) => (
                      <SelectItem key={kategori.id_kategori} value={kategori.id_kategori!} className="text-sm">
                        {kategori.nama_kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="id_merek" className="text-sm">
                  Merek Aset <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.id_merek}
                  onValueChange={(value) => handleInputChange('id_merek', value)}
                  disabled={isLoading || isLoadingMaster}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Pilih merek" />
                  </SelectTrigger>
                  <SelectContent>
                    {merekList.map((merek) => (
                      <SelectItem key={merek.id_merek} value={merek.id_merek!} className="text-sm">
                        {merek.nama_merek}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tipe Aset */}
            <div className="grid gap-2">
              <Label htmlFor="id_tipe" className="text-sm">
                Tipe Aset <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.id_tipe}
                onValueChange={(value) => handleInputChange('id_tipe', value)}
                disabled={isLoading || isLoadingMaster}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  {tipeList.map((tipe) => (
                    <SelectItem key={tipe.id_tipe} value={tipe.id_tipe!} className="text-sm">
                      {tipe.nama_tipe}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Umur Ekonomis & Metode - 2 kolom di desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="umur_ekonomis" className="text-sm">
                  Umur Ekonomis (Tahun) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="umur_ekonomis"
                  type="number"
                  min="1"
                  placeholder="Contoh: 5"
                  value={formData.umur_ekonomis}
                  onChange={(e) => handleInputChange('umur_ekonomis', e.target.value)}
                  disabled={isLoading}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Perkiraan masa pakai aset
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="metode_penyusutan" className="text-sm">
                  Metode Penyusutan <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.metode_penyusutan}
                  onValueChange={(value) => handleInputChange('metode_penyusutan', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Pilih metode" />
                  </SelectTrigger>
                  <SelectContent>
                    {METODE_PENYUSUTAN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-sm">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Metode perhitungan depresiasi
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || isLoadingMaster}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahMasterAset;