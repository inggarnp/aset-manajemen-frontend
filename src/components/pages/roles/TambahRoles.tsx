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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface Permission {
  id_permission: string;
  nama_permission: string;
}

interface TambahRoleProps {
  onSuccess: () => void;
}

const TambahRole: React.FC<TambahRoleProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    kode_role: '',
    nama_role: '',
  });

  useEffect(() => {
    if (open) {
      fetchPermissions();
    }
  }, [open]);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/api/permissions');
      setPermissions(response.data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Gagal memuat permissions',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map((p) => p.id_permission));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Create role
      const roleResponse = await api.post('/api/roles', formData);
      
      // 2. Get role ID from response or extract from success message
      // Since backend returns { message: "role created" }, we need to fetch the newly created role
      const rolesResponse = await api.get('/api/roles');
      const newRole = rolesResponse.data.find(
        (r: any) => r.kode_role === formData.kode_role
      );

      if (newRole && selectedPermissions.length > 0) {
        // 3. Assign permissions to the new role
        await api.post(`/api/roles/${newRole.id_role}/permissions`, {
          permission_ids: selectedPermissions,
        });
      }

      toast({
        title: 'Success',
        description: 'Role dan permissions berhasil ditambahkan',
      });

      // Reset form
      setFormData({
        kode_role: '',
        nama_role: '',
      });
      setSelectedPermissions([]);
      
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal menambahkan role';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const [module] = perm.nama_permission.split('.');
    if (!acc[module]) {
      acc[module] = [];
    }
    acc[module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const moduleNames: Record<string, string> = {
    jabatan: 'Jabatan',
    departemen: 'Departemen',
    user: 'User',
    role: 'Role',
    asset: 'Asset',
    report: 'Report',
    dashboard: 'Dashboard',
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Tambah Role</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Tambah Role</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Tambahkan role baru dan atur permissions-nya
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Role Info */}
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

            {/* Permissions */}
            <div className="grid gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Label className="text-sm">Permissions</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs sm:text-sm w-full sm:w-auto"
                >
                  {selectedPermissions.length === permissions.length
                    ? 'Unselect All'
                    : 'Select All'}
                </Button>
              </div>
              
              <ScrollArea className="h-[250px] sm:h-[300px] rounded-md border p-3 sm:p-4">
                {Object.entries(groupedPermissions).map(([module, perms]) => (
                  <div key={module} className="mb-3 sm:mb-4">
                    <h4 className="font-semibold text-xs sm:text-sm mb-2">
                      {moduleNames[module] || module}
                    </h4>
                    <div className="space-y-2 ml-2">
                      {perms.map((perm) => (
                        <div
                          key={perm.id_permission}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={perm.id_permission}
                            checked={selectedPermissions.includes(perm.id_permission)}
                            onCheckedChange={() =>
                              handlePermissionToggle(perm.id_permission)
                            }
                          />
                          <label
                            htmlFor={perm.id_permission}
                            className="text-xs sm:text-sm cursor-pointer leading-tight"
                          >
                            {perm.nama_permission}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
              
              <p className="text-xs text-muted-foreground">
                {selectedPermissions.length} permission(s) dipilih
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
              {isLoading ? 'Menyimpan...' : 'Tambah Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahRole;