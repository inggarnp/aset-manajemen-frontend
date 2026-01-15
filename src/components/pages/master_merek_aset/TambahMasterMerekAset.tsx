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

interface TambahMasterMerekAsetProps {
  onSuccess: () => void;
}

interface FormData {
  nama_merek: string;
  keterangan: string;
}

const TambahMasterMerekAset: React.FC<TambahMasterMerekAsetProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nama_merek: '',
    keterangan: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nama_merek.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Nama merek harus diisi',
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
        nama_merek: formData.nama_merek.trim(),
        keterangan: formData.keterangan.trim(),
      };

      await api.post('/api/master-merek-aset', payload);

      toast({
        title: 'Success',
        description: 'Master merek aset berhasil ditambahkan',
      });

      setFormData({
        nama_merek: '',
        keterangan: '',
      });

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create master merek';
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
          <span className="hidden sm:inline">Tambah Merek</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Tambah Master Merek Aset</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Isi form di bawah untuk menambahkan merek aset baru
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Nama Merek */}
            <div className="grid gap-2">
              <Label htmlFor="nama_merek" className="text-sm">
                Nama Merek <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_merek"
                placeholder="Contoh: Dell, HP, Lenovo, IKEA"
                value={formData.nama_merek}
                onChange={(e) => handleInputChange('nama_merek', e.target.value)}
                disabled={isLoading}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Nama merek/brand yang akan digunakan
              </p>
            </div>

            {/* Keterangan */}
            <div className="grid gap-2">
              <Label htmlFor="keterangan" className="text-sm">
                Keterangan
              </Label>
              <Textarea
                id="keterangan"
                placeholder="Deskripsi merek aset (opsional)"
                value={formData.keterangan}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                disabled={isLoading}
                className="text-sm min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Penjelasan singkat tentang merek ini
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

export default TambahMasterMerekAset;