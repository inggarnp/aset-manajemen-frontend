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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Role {
  id_role: string;
  kode_role: string;
  nama_role: string;
}

interface Permission {
  id_permission: string;
  nama_permission: string;
}

interface AturPermissionProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AturPermission: React.FC<AturPermissionProps> = ({ 
  role, 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (role && open) {
      fetchData();
    }
  }, [role, open]);

  const fetchData = async () => {
    if (!role) return;

    setIsLoading(true);
    try {
      // Fetch all permissions
      const permResponse = await api.get('/api/permissions');
      setPermissions(permResponse.data || []);

      // Fetch current role permissions
      const rolePermResponse = await api.get(`/api/roles/${role.id_role}/permissions`);
      setSelectedPermissions(rolePermResponse.data.permissions || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data permissions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
    if (!role) return;

    setIsSaving(true);

    try {
      await api.post(`/api/roles/${role.id_role}/permissions`, {
        permission_ids: selectedPermissions,
      });

      toast({
        title: 'Success',
        description: 'Permissions berhasil diupdate',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal mengupdate permissions';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Atur Permission - {role?.nama_role}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Pilih permissions yang ingin diberikan ke role ini
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
              {/* Role Info */}
              <div className="flex flex-wrap items-center gap-2 p-2 sm:p-3 bg-muted rounded-md">
                <span className="text-xs sm:text-sm font-medium">Role:</span>
                <Badge variant="secondary" className="text-xs">{role?.kode_role}</Badge>
                <span className="text-xs sm:text-sm">{role?.nama_role}</span>
              </div>

              {/* Select All Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {selectedPermissions.length} dari {permissions.length} permission dipilih
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  {selectedPermissions.length === permissions.length
                    ? 'Unselect All'
                    : 'Select All'}
                </Button>
              </div>

              {/* Permissions List */}
              <ScrollArea className="h-[300px] sm:h-[400px] rounded-md border p-3 sm:p-4">
                {Object.entries(groupedPermissions).map(([module, perms]) => (
                  <div key={module} className="mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h4 className="font-semibold text-xs sm:text-sm">
                        {moduleNames[module] || module}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {perms.filter(p => selectedPermissions.includes(p.id_permission)).length}/{perms.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3 ml-1 sm:ml-2">
                      {perms.map((perm) => {
                        const isChecked = selectedPermissions.includes(perm.id_permission);
                        return (
                          <div
                            key={perm.id_permission}
                            className="flex items-center space-x-2 sm:space-x-3 hover:bg-muted/50 p-1.5 sm:p-2 rounded-md transition-colors"
                          >
                            <Checkbox
                              id={perm.id_permission}
                              checked={isChecked}
                              onCheckedChange={() =>
                                handlePermissionToggle(perm.id_permission)
                              }
                              className="shrink-0"
                            />
                            <label
                              htmlFor={perm.id_permission}
                              className="text-xs sm:text-sm cursor-pointer flex-1 select-none leading-tight"
                            >
                              {perm.nama_permission}
                            </label>
                            {isChecked && (
                              <Badge variant="secondary" className="text-xs shrink-0">
                                ✓
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isSaving || isLoading}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Permission'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AturPermission;