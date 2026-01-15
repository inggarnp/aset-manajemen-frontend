import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface Role {
  id_role: string;
  kode_role: string;
  nama_role: string;
  created_at: string;
  updated_at: string;
}

interface ViewRoleProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewRole: React.FC<ViewRoleProps> = ({ role, open, onOpenChange }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (role && open) {
      fetchPermissions();
    }
  }, [role, open]);

  const fetchPermissions = async () => {
    if (!role) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/api/roles/${role.id_role}/permissions`);
      setPermissions(response.data.permissions || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Gagal memuat permissions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Detail Role</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap tentang role
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Role Info */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">ID Role:</span>
              <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-mono break-all">{role?.id_role}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Kode:</span>
              <span className="col-span-1 sm:col-span-2">
                <Badge variant="secondary" className="text-xs">{role?.kode_role}</Badge>
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Nama:</span>
              <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-semibold">{role?.nama_role}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Created:</span>
              <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">{role?.created_at && formatDate(role.created_at)}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Updated:</span>
              <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">{role?.updated_at && formatDate(role.updated_at)}</span>
            </div>
          </div>

          <Separator />

          {/* Permissions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium">Permissions</span>
              <Badge variant="outline" className="text-xs">{permissions.length}</Badge>
            </div>
            
            {isLoading ? (
              <div className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                Loading permissions...
              </div>
            ) : permissions.length === 0 ? (
              <div className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                Tidak ada permissions
              </div>
            ) : (
              <ScrollArea className="h-[150px] sm:h-[200px] rounded-md border p-2 sm:p-3">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {permissions.map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRole;