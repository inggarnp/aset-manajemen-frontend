import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface TambahMasterKategoriAsetProps {
  onSuccess: () => void;
}

interface FormData {
  nama_kategori: string;
  keterangan: string;
}

const TambahMasterKategoriAset: React.FC<TambahMasterKategoriAsetProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nama_kategori: '',
    keterangan: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nama_kategori.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Nama kategori harus diisi',
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
        nama_kategori: formData.nama_kategori.trim(),
        keterangan: formData.keterangan.trim(),
      };

      await api.post('/api/master-kategori-aset', payload);

      toast({
        title: 'Success',
        description: 'Master kategori aset berhasil ditambahkan',
      });

      setFormData({
        nama_kategori: '',
        keterangan: '',
      });

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create master kategori';
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
          <span className="hidden sm:inline">Tambah Kategori</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Tambah Master Kategori Aset</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Isi form di bawah untuk menambahkan kategori aset baru
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Nama Kategori */}
            <div className="grid gap-2">
              <Label htmlFor="nama_kategori" className="text-sm">
                Nama Kategori <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_kategori"
                placeholder="Contoh: Elektronik, Furniture, Kendaraan"
                value={formData.nama_kategori}
                onChange={(e) => handleInputChange('nama_kategori', e.target.value)}
                disabled={isLoading}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Nama kategori aset yang akan digunakan
              </p>
            </div>

            {/* Keterangan */}
            <div className="grid gap-2">
              <Label htmlFor="keterangan" className="text-sm">
                Keterangan
              </Label>
              <Textarea
                id="keterangan"
                placeholder="Deskripsi kategori aset (opsional)"
                value={formData.keterangan}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                disabled={isLoading}
                className="text-sm min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Penjelasan singkat tentang kategori ini
              </p>
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
              disabled={isLoading}
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

export default TambahMasterKategoriAset;