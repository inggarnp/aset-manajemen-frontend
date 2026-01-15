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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RiwayatPemakaian {
  id_riwayat: string;
  id_aset: string;
  id_user: string;
  tanggal_mulai_pakai: string;
  tanggal_selesai_pakai: string | null;
  lokasi_pemakaian: string;
  kondisi_aset: string;
  keterangan: string;
}

interface EditRiwayatPemakaianProps {
  riwayat: RiwayatPemakaian | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Aset {
  id_aset: string;
  nama_aset: string;
  kode_aset: string;
}

interface User {
  id_user: string;
  nama_user: string;
  email: string;
}

const KONDISI_OPTIONS = [
  { value: 'Baik', label: 'Baik' },
  { value: 'Rusak Ringan', label: 'Rusak Ringan' },
  { value: 'Rusak Berat', label: 'Rusak Berat' },
];

const EditRiwayatPemakaian: React.FC<EditRiwayatPemakaianProps> = ({ 
  riwayat, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [asetList, setAsetList] = useState<Aset[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [dateError, setDateError] = useState('');
  
  const [formData, setFormData] = useState({
    id_aset: '',
    id_user: '',
    tanggal_mulai_pakai: '',
    tanggal_selesai_pakai: '',
    lokasi_pemakaian: '',
    kondisi_aset: '',
    keterangan: '',
  });

  useEffect(() => {
    if (riwayat && open) {
      setFormData({
        id_aset: riwayat.id_aset,
        id_user: riwayat.id_user,
        tanggal_mulai_pakai: riwayat.tanggal_mulai_pakai,
        tanggal_selesai_pakai: riwayat.tanggal_selesai_pakai || '',
        lokasi_pemakaian: riwayat.lokasi_pemakaian,
        kondisi_aset: riwayat.kondisi_aset,
        keterangan: riwayat.keterangan,
      });
      fetchDropdownData();
      setDateError('');
    }
  }, [riwayat, open]);

  // Validate dates whenever they change
  useEffect(() => {
    if (formData.tanggal_mulai_pakai && formData.tanggal_selesai_pakai) {
      const startDate = new Date(formData.tanggal_mulai_pakai);
      const endDate = new Date(formData.tanggal_selesai_pakai);
      
      if (endDate < startDate) {
        setDateError('Tanggal selesai tidak boleh lebih awal dari tanggal mulai');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  }, [formData.tanggal_mulai_pakai, formData.tanggal_selesai_pakai]);

  const fetchDropdownData = async () => {
    try {
      const [asetRes, userRes] = await Promise.all([
        api.get('/api/aset'),
        api.get('/api/users'),
      ]);

      setAsetList(asetRes.data);
      setUserList(userRes.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load form data',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riwayat) return;

    if (dateError) {
      toast({
        title: 'Validation Error',
        description: dateError,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        id_aset: formData.id_aset,
        id_user: formData.id_user,
        tanggal_mulai_pakai: formData.tanggal_mulai_pakai,
        tanggal_selesai_pakai: formData.tanggal_selesai_pakai || null,
        lokasi_pemakaian: formData.lokasi_pemakaian.trim(),
        kondisi_aset: formData.kondisi_aset,
        keterangan: formData.keterangan.trim(),
      };

      await api.put(`/api/riwayat-pemakaian/${riwayat.id_riwayat}`, payload);

      toast({
        title: 'Success',
        description: 'Riwayat pemakaian berhasil diupdate',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal mengupdate riwayat pemakaian';
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
      <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="text-lg sm:text-xl">Edit Riwayat Pemakaian</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update informasi riwayat pemakaian aset
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Aset */}
            <div className="grid gap-2">
              <Label htmlFor="id_aset" className="text-sm">
                Aset <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.id_aset}
                onValueChange={(value) => handleInputChange('id_aset', value)}
                disabled={isLoading}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Pilih aset" />
                </SelectTrigger>
                <SelectContent>
                  {asetList.map((aset) => (
                    <SelectItem key={aset.id_aset} value={aset.id_aset} className="text-sm">
                      <span className="block sm:hidden">{aset.nama_aset}</span>
                      <span className="hidden sm:block">{aset.kode_aset} - {aset.nama_aset}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* User */}
            <div className="grid gap-2">
              <Label htmlFor="id_user" className="text-sm">
                User <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.id_user}
                onValueChange={(value) => handleInputChange('id_user', value)}
                disabled={isLoading}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Pilih user" />
                </SelectTrigger>
                <SelectContent>
                  {userList.map((user) => (
                    <SelectItem key={user.id_user} value={user.id_user} className="text-sm">
                      <span className="block sm:hidden">{user.nama_user}</span>
                      <span className="hidden sm:block">{user.nama_user} ({user.email})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tanggal Mulai & Selesai - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Tanggal Mulai Pakai */}
              <div className="grid gap-2">
                <Label htmlFor="tanggal_mulai_pakai" className="text-sm">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tanggal_mulai_pakai"
                  type="date"
                  value={formData.tanggal_mulai_pakai}
                  onChange={(e) => handleInputChange('tanggal_mulai_pakai', e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-sm"
                />
              </div>

              {/* Tanggal Selesai Pakai */}
              <div className="grid gap-2">
                <Label htmlFor="tanggal_selesai_pakai" className="text-sm">
                  Tanggal Selesai <span className="text-xs text-muted-foreground">(Opsional)</span>
                </Label>
                <Input
                  id="tanggal_selesai_pakai"
                  type="date"
                  value={formData.tanggal_selesai_pakai}
                  onChange={(e) => handleInputChange('tanggal_selesai_pakai', e.target.value)}
                  disabled={isLoading}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Date Error Alert */}
            {dateError && (
              <Alert variant="destructive" className="text-xs sm:text-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{dateError}</AlertDescription>
              </Alert>
            )}

            <p className="text-xs text-muted-foreground -mt-1 sm:-mt-2">
              💡 Kosongkan tanggal selesai jika aset masih digunakan. Sistem akan mencegah duplikasi periode penggunaan aset yang sama.
            </p>

            {/* Lokasi Pemakaian */}
            <div className="grid gap-2">
              <Label htmlFor="lokasi_pemakaian" className="text-sm">
                Lokasi Pemakaian <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lokasi_pemakaian"
                value={formData.lokasi_pemakaian}
                onChange={(e) => handleInputChange('lokasi_pemakaian', e.target.value)}
                placeholder="Contoh: Ruang IT Lantai 3"
                required
                disabled={isLoading}
                className="text-sm"
              />
            </div>

            {/* Kondisi Aset */}
            <div className="grid gap-2">
              <Label htmlFor="kondisi_aset" className="text-sm">
                Kondisi Aset <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.kondisi_aset}
                onValueChange={(value) => handleInputChange('kondisi_aset', value)}
                disabled={isLoading}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Pilih kondisi" />
                </SelectTrigger>
                <SelectContent>
                  {KONDISI_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-sm">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Keterangan */}
            <div className="grid gap-2">
              <Label htmlFor="keterangan" className="text-sm">
                Keterangan <span className="text-xs text-muted-foreground">(Opsional)</span>
              </Label>
              <Textarea
                id="keterangan"
                value={formData.keterangan}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                placeholder="Catatan tambahan"
                disabled={isLoading}
                rows={3}
                className="text-sm resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !!dateError} 
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Menyimpan...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRiwayatPemakaian;