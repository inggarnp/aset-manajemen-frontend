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

interface TambahJabatanProps {
  onSuccess: () => void;
}

const TambahJabatan: React.FC<TambahJabatanProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    kode_jabatan: '',
    nama_jabatan: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/api/jabatan', formData);
      
      toast({
        title: 'Success',
        description: 'Jabatan berhasil ditambahkan',
      });

      setFormData({
        kode_jabatan: '',
        nama_jabatan: '',
      });
      
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menambahkan jabatan';
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
          <span className="hidden sm:inline">Tambah Jabatan</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Tambah Jabatan</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Tambahkan jabatan baru ke dalam sistem
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="grid gap-2">
              <Label htmlFor="kode_jabatan" className="text-sm">
                Kode Jabatan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kode_jabatan"
                name="kode_jabatan"
                value={formData.kode_jabatan}
                onChange={handleChange}
                placeholder="Contoh: HR"
                required
                className="text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nama_jabatan" className="text-sm">
                Nama Jabatan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_jabatan"
                name="nama_jabatan"
                value={formData.nama_jabatan}
                onChange={handleChange}
                placeholder="Contoh: Human Resource"
                required
                className="text-sm"
              />
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
              {isLoading ? 'Menyimpan...' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahJabatan;