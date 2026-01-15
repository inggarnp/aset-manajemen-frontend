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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface MasterKategoriAset {
  id_kategori: string;
  nama_kategori: string;
  keterangan: string;
}

interface EditMasterKategoriAsetProps {
  kategori: MasterKategoriAset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditMasterKategoriAset: React.FC<EditMasterKategoriAsetProps> = ({ 
  kategori, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nama_kategori: '',
    keterangan: '',
  });

  useEffect(() => {
    if (kategori && open) {
      setFormData({
        nama_kategori: kategori.nama_kategori,
        keterangan: kategori.keterangan || '',
      });
    }
  }, [kategori, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kategori) return;

    if (!formData.nama_kategori.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Nama kategori harus diisi',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        nama_kategori: formData.nama_kategori.trim(),
        keterangan: formData.keterangan.trim(),
      };

      await api.put(`/api/master-kategori-aset/${kategori.id_kategori}`, payload);

      toast({
        title: 'Success',
        description: 'Master kategori aset berhasil diupdate',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal mengupdate master kategori';
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
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Master Kategori Aset</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update informasi kategori aset
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Nama Kategori */}
            <div className="grid gap-2">
              <Label htmlFor="nama_kategori" className="text-sm">
                Nama Kategori <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_kategori"
                value={formData.nama_kategori}
                onChange={(e) => handleInputChange('nama_kategori', e.target.value)}
                placeholder="Contoh: Elektronik"
                required
                disabled={isLoading}
                className="text-sm"
              />
            </div>

            {/* Keterangan */}
            <div className="grid gap-2">
              <Label htmlFor="keterangan" className="text-sm">
                Keterangan
              </Label>
              <Textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                placeholder="Deskripsi kategori aset (opsional)"
                disabled={isLoading}
                className="text-sm min-h-[100px]"
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
              {isLoading ? 'Menyimpan...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMasterKategoriAset;