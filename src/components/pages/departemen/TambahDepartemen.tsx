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
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface TambahDepartemenProps {
  onSuccess: () => void;
}

const TambahDepartemen: React.FC<TambahDepartemenProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    kode_departemen: '',
    nama_departemen: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await api.post('/api/departemen', formData);
      
      toast({
        title: 'Success',
        description: 'Departemen berhasil ditambahkan',
      });

      setFormData({
        kode_departemen: '',
        nama_departemen: '',
      });
      
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menambahkan departemen';
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
          <span className="hidden sm:inline">Tambah Departemen</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Tambah Departemen</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Tambahkan departemen baru ke dalam sistem
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="grid gap-2">
              <Label htmlFor="kode_departemen" className="text-sm">
                Kode Departemen <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kode_departemen"
                name="kode_departemen"
                value={formData.kode_departemen}
                onChange={handleChange}
                placeholder="Contoh: IT"
                required
                className="text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nama_departemen" className="text-sm">
                Nama Departemen <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_departemen"
                name="nama_departemen"
                value={formData.nama_departemen}
                onChange={handleChange}
                placeholder="Contoh: Information Technology"
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

export default TambahDepartemen;