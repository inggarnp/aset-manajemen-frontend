import React, { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Plus, Upload, X } from 'lucide-react';

interface TambahUserProps {
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

interface FormData {
  nama_user: string;
  email: string;
  password: string;
  phone_number: string;
  nik: string;
  id_jabatan: string;
  id_departemen: string;
  id_role: string;
  foto_user: File | null;
}

const TambahUser: React.FC<TambahUserProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [departemenList, setDepartemenList] = useState<Departemen[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    nama_user: '',
    email: '',
    password: '',
    phone_number: '',
    nik: '',
    id_jabatan: '',
    id_departemen: '',
    id_role: '',
    foto_user: null,
  });

  useEffect(() => {
    if (open) {
      fetchDropdownData();
    }
  }, [open]);

  const fetchDropdownData = async () => {
    try {
      const [jabatanRes, departemenRes, roleRes] = await Promise.all([
        api.get('/api/jabatan'),
        api.get('/api/departemen'),
        api.get('/api/roles'),
      ]);

      setJabatanList(jabatanRes.data || []);
      setDepartemenList(departemenRes.data || []);
      setRoleList(roleRes.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load form data',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
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

      setFormData((prev) => ({ ...prev, foto_user: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, foto_user: null }));
    setPreviewUrl(null);
  };

  const validateForm = (): boolean => {
    if (!formData.nama_user.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Nama user harus diisi',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: 'Validation Error',
        description: 'Email tidak valid',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password minimal 6 karakter',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.phone_number.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Nomor telepon harus diisi',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.nik.trim()) {
      toast({
        title: 'Validation Error',
        description: 'NIK harus diisi',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.id_jabatan) {
      toast({
        title: 'Validation Error',
        description: 'Jabatan harus dipilih',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.id_departemen) {
      toast({
        title: 'Validation Error',
        description: 'Departemen harus dipilih',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.id_role) {
      toast({
        title: 'Validation Error',
        description: 'Role harus dipilih',
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

      const submitData = new FormData();
      submitData.append('nama_user', formData.nama_user);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('phone_number', formData.phone_number);
      submitData.append('nik', formData.nik);
      submitData.append('id_jabatan', formData.id_jabatan);
      submitData.append('id_departemen', formData.id_departemen);
      submitData.append('id_role', formData.id_role);
      
      if (formData.foto_user) {
        submitData.append('foto_user', formData.foto_user);
      }

      await api.post('/api/users', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Success',
        description: 'User berhasil ditambahkan',
      });

      setFormData({
        nama_user: '',
        email: '',
        password: '',
        phone_number: '',
        nik: '',
        id_jabatan: '',
        id_departemen: '',
        id_role: '',
        foto_user: null,
      });
      setPreviewUrl(null);

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create user';
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
          <span className="hidden sm:inline">Tambah User</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Tambah User Baru</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Isi form di bawah untuk menambahkan user baru ke sistem
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Foto User */}
            <div className="grid gap-2">
              <Label htmlFor="foto_user" className="text-sm">Foto User</Label>
              <div className="space-y-2">
                {previewUrl ? (
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border-2 border-muted"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
              </div>
              <p className="text-xs text-muted-foreground">
                Foto akan disimpan di folder berdasarkan role yang dipilih
              </p>
            </div>

            {/* Nama & Email - 2 kolom di desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nama_user" className="text-sm">
                  Nama User <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama_user"
                  placeholder="Nama lengkap"
                  value={formData.nama_user}
                  onChange={(e) => handleInputChange('nama_user', e.target.value)}
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
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Password & Phone - 2 kolom di desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 6 karakter"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isLoading}
                  className="text-sm"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone_number" className="text-sm">
                  Nomor Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone_number"
                  placeholder="08123456789"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  disabled={isLoading}
                  className="text-sm"
                />
              </div>
            </div>

            {/* NIK */}
            <div className="grid gap-2">
              <Label htmlFor="nik" className="text-sm">
                NIK <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nik"
                placeholder="16 digit NIK"
                maxLength={16}
                value={formData.nik}
                onChange={(e) => handleInputChange('nik', e.target.value)}
                disabled={isLoading}
                className="text-sm"
              />
            </div>

            {/* Jabatan & Departemen - 2 kolom di desktop */}
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
              {formData.id_role && (
                <p className="text-xs text-blue-600">
                  Foto akan disimpan di: image/foto_user/
                  {(() => {
                    const selectedRole = roleList.find(r => r.id_role === formData.id_role);
                    const roleName = selectedRole?.nama_role.toLowerCase().replace(/ /g, '_') || '[role]';
                    return roleName === 'admin' 
                      ? 'admin/' 
                      : `karyawan/${roleName}/`;
                  })()}
                </p>
              )}
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

export default TambahUser;