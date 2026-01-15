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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface User {
  id_user: string;
  nama_user: string;
  email: string;
  phone_number: string;
  nik: string;
  foto_user?: string | null;
  id_jabatan: string;
  id_departemen: string;
  id_role: string;
}

interface EditUserProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Jabatan {
  id_jabatan: string;
  nama_jabatan: string;
}

interface Departemen {
  id_departemen: string;
  nama_departemen: string;
}

interface Role {
  id_role: string;
  nama_role: string;
}

const EditUser: React.FC<EditUserProps> = ({ user, open, onOpenChange, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [departemenList, setDepartemenList] = useState<Departemen[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nama_user: '',
    email: '',
    phone_number: '',
    nik: '',
    id_jabatan: '',
    id_departemen: '',
    id_role: '',
  });

  useEffect(() => {
    if (user && open) {
      setFormData({
        nama_user: user.nama_user,
        email: user.email,
        phone_number: user.phone_number,
        nik: user.nik,
        id_jabatan: user.id_jabatan,
        id_departemen: user.id_departemen,
        id_role: user.id_role,
      });
      setNewPhoto(null);
      setPreviewUrl(null);
      fetchDropdownData();
    }
  }, [user, open]);

  const fetchDropdownData = async () => {
    try {
      const [jabatanRes, departemenRes, roleRes] = await Promise.all([
        api.get('/api/jabatan'),
        api.get('/api/departemen'),
        api.get('/api/roles'),
      ]);

      setJabatanList(jabatanRes.data);
      setDepartemenList(departemenRes.data);
      setRoleList(roleRes.data);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: 'Only JPG, JPEG, and PNG files are allowed',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'File size must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }

      setNewPhoto(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeNewPhoto = () => {
    setNewPhoto(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('nama_user', formData.nama_user);
      submitData.append('email', formData.email);
      submitData.append('phone_number', formData.phone_number);
      submitData.append('nik', formData.nik);
      submitData.append('id_jabatan', formData.id_jabatan);
      submitData.append('id_departemen', formData.id_departemen);
      submitData.append('id_role', formData.id_role);
      
      if (newPhoto) {
        submitData.append('foto_user', newPhoto);
      }

      await api.put(`/api/users/${user.id_user}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Success',
        description: 'User berhasil diupdate',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal mengupdate user';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPhotoUrl = () => {
    if (user?.foto_user) {
      return `http://localhost:8080/${user.foto_user}`;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit User</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update informasi user. Password tidak dapat diubah melalui form ini.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Foto User */}
            <div className="grid gap-2">
              <Label className="text-sm">Foto User</Label>
              <div className="space-y-2">
                {previewUrl || getCurrentPhotoUrl() ? (
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                    <img
                      src={previewUrl || getCurrentPhotoUrl()!}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border-2 border-muted"
                    />
                    {previewUrl && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={removeNewPhoto}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="foto_user"
                      className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex flex-col items-center justify-center pt-3 pb-3 sm:pt-5 sm:pb-6">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-muted-foreground" />
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 5MB)</p>
                      </div>
                      <Input
                        id="foto_user"
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                )}
                
                {!previewUrl && getCurrentPhotoUrl() && (
                  <div className="text-center">
                    <label htmlFor="foto_user_change">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('foto_user_change')?.click()}
                        className="text-xs sm:text-sm"
                      >
                        <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Ganti Foto
                      </Button>
                    </label>
                    <Input
                      id="foto_user_change"
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>
              {formData.id_role && roleList.length > 0 && (
                <p className="text-xs text-blue-600">
                  Foto akan disimpan di: image/foto_user/
                  {(() => {
                    const selectedRole = roleList.find(r => r.id_role === formData.id_role);
                    const roleName = selectedRole?.nama_role.toLowerCase().replace(/ /g, '_') || '[role]';
                    return roleName === 'admin' ? 'admin/' : `karyawan/${roleName}/`;
                  })()}
                </p>
              )}
            </div>

            {/* Nama & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nama_user" className="text-sm">
                  Nama User <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama_user"
                  value={formData.nama_user}
                  onChange={(e) => handleInputChange('nama_user', e.target.value)}
                  placeholder="Nama lengkap"
                  required
                  disabled={isLoading}
                  className="text-sm"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="user@example.com"
                  required
                  disabled={isLoading}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Phone & NIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone_number" className="text-sm">
                  Nomor Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  placeholder="08123456789"
                  required
                  disabled={isLoading}
                  className="text-sm"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nik" className="text-sm">
                  NIK <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nik"
                  value={formData.nik}
                  onChange={(e) => handleInputChange('nik', e.target.value)}
                  placeholder="16 digit NIK"
                  maxLength={16}
                  required
                  disabled={isLoading}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Jabatan & Departemen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="id_jabatan" className="text-sm">
                  Jabatan <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.id_jabatan}
                  onValueChange={(value) => handleInputChange('id_jabatan', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Pilih jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {jabatanList.map((jabatan) => (
                      <SelectItem key={jabatan.id_jabatan} value={jabatan.id_jabatan} className="text-sm">
                        {jabatan.nama_jabatan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="id_departemen" className="text-sm">
                  Departemen <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.id_departemen}
                  onValueChange={(value) => handleInputChange('id_departemen', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Pilih departemen" />
                  </SelectTrigger>
                  <SelectContent>
                    {departemenList.map((departemen) => (
                      <SelectItem key={departemen.id_departemen} value={departemen.id_departemen} className="text-sm">
                        {departemen.nama_departemen}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label htmlFor="id_role" className="text-sm">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.id_role}
                onValueChange={(value) => handleInputChange('id_role', value)}
                disabled={isLoading}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roleList.map((role) => (
                    <SelectItem key={role.id_role} value={role.id_role} className="text-sm">
                      {role.nama_role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default EditUser;