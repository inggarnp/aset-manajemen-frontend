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
import { toast } from '@/hooks/use-toast';

interface Departemen {
  id_departemen: string;
  kode_departemen: string;
  nama_departemen: string;
}

interface EditDepartemenProps {
  departemen: Departemen | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditDepartemen: React.FC<EditDepartemenProps> = ({ 
  departemen, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    kode_departemen: '',
    nama_departemen: '',
  });

  useEffect(() => {
    if (departemen) {
      setFormData({
        kode_departemen: departemen.kode_departemen,
        nama_departemen: departemen.nama_departemen,
      });
    }
  }, [departemen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departemen) return;
    
    setIsLoading(true);

    try {
      await api.put(`/api/departemen/${departemen.id_departemen}`, formData);
      
      toast({
        title: 'Success',
        description: 'Departemen berhasil diupdate',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mengupdate departemen';
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
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Departemen</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update informasi departemen
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
              onClick={() => onOpenChange(false)}
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
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartemen;