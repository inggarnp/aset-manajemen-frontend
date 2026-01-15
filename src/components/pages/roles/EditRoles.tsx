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

interface Role {
  id_role: string;
  kode_role: string;
  nama_role: string;
}

interface EditRoleProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditRole: React.FC<EditRoleProps> = ({ role, open, onOpenChange, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    kode_role: '',
    nama_role: '',
  });

  useEffect(() => {
    if (role) {
      setFormData({
        kode_role: role.kode_role,
        nama_role: role.nama_role,
      });
    }
  }, [role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setIsLoading(true);

    try {
      await api.put(`/api/roles/${role.id_role}`, formData);
      
      toast({
        title: 'Success',
        description: 'Role berhasil diupdate',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal mengupdate role';
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
            <DialogTitle className="text-lg sm:text-xl">Edit Role</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update informasi role. Untuk mengatur permissions, gunakan menu "Atur Permission".
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="grid gap-2">
              <Label htmlFor="kode_role" className="text-sm">
                Kode Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kode_role"
                name="kode_role"
                value={formData.kode_role}
                onChange={handleChange}
                placeholder="Contoh: manager"
                required
                className="text-sm"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="nama_role" className="text-sm">
                Nama Role <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_role"
                name="nama_role"
                value={formData.nama_role}
                onChange={handleChange}
                placeholder="Contoh: Manager"
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
              {isLoading ? 'Menyimpan...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRole;