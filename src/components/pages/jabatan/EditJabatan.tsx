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

interface Jabatan {
  id_jabatan: string;
  kode_jabatan: string;
  nama_jabatan: string;
  deskripsi?: string;
}

interface EditJabatanProps {
  jabatan: Jabatan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditJabatan: React.FC<EditJabatanProps> = ({ 
  jabatan, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    kode_jabatan: '',
    nama_jabatan: '',
  });

  useEffect(() => {
    if (jabatan) {
      setFormData({
        kode_jabatan: jabatan.kode_jabatan,
        nama_jabatan: jabatan.nama_jabatan,
      });
    }
  }, [jabatan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jabatan) return;
    
    setIsLoading(true);

    try {
      await api.put(`/api/jabatan/${jabatan.id_jabatan}`, formData);
      
      toast({
        title: 'Success',
        description: 'Jabatan berhasil diupdate',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mengupdate jabatan';
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
            <DialogTitle className="text-lg sm:text-xl">Edit Jabatan</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update informasi jabatan
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
                placeholder="Contoh: ADM"
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
                placeholder="Contoh: Administrator Updated"
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

export default EditJabatan;