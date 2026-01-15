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

interface TambahMasterTipeAsetProps {
  onSuccess: () => void;
}

interface FormData {
  nama_tipe: string;
  keterangan: string;
}

const TambahMasterTipeAset: React.FC<TambahMasterTipeAsetProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nama_tipe: '',
    keterangan: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nama_tipe.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Nama tipe harus diisi',
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
        nama_tipe: formData.nama_tipe.trim(),
        keterangan: formData.keterangan.trim(),
      };

      await api.post('/api/master-tipe-aset', payload);

      toast({
        title: 'Success',
        description: 'Master tipe aset berhasil ditambahkan',
      });

      setFormData({
        nama_tipe: '',
        keterangan: '',
      });

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create master tipe';
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
          <span className="hidden sm:inline">Tambah Tipe</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Tambah Master Tipe Aset</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Isi form di bawah untuk menambahkan tipe aset baru
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Nama Tipe */}
            <div className="grid gap-2">
              <Label htmlFor="nama_tipe" className="text-sm">
                Nama Tipe <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_tipe"
                placeholder="Contoh: Laptop, Monitor, Meja Kerja"
                value={formData.nama_tipe}
                onChange={(e) => handleInputChange('nama_tipe', e.target.value)}
                disabled={isLoading}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Nama tipe/jenis aset yang akan digunakan
              </p>
            </div>

            {/* Keterangan */}
            <div className="grid gap-2">
              <Label htmlFor="keterangan" className="text-sm">
                Keterangan
              </Label>
              <Textarea
                id="keterangan"
                placeholder="Deskripsi tipe aset (opsional)"
                value={formData.keterangan}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                disabled={isLoading}
                className="text-sm min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Penjelasan singkat tentang tipe ini
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

export default TambahMasterTipeAset;