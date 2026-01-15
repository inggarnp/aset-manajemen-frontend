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
import { toast } from '@/hooks/use-toast';
import { Loader2, User as UserIcon } from 'lucide-react';

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
  created_at?: string;
  updated_at?: string;
}

interface ViewUserProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DetailData {
  jabatan: string;
  departemen: string;
  role: string;
}

const ViewUser: React.FC<ViewUserProps> = ({ user, open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [detailData, setDetailData] = useState<DetailData>({
    jabatan: '',
    departemen: '',
    role: '',
  });

  useEffect(() => {
    if (user && open) {
      fetchDetailData();
    }
  }, [user, open]);

  const fetchDetailData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [jabatanRes, departemenRes, roleRes] = await Promise.all([
        api.get('/api/jabatan'),
        api.get('/api/departemen'),
        api.get('/api/roles'),
      ]);

      const jabatan = jabatanRes.data.find((j: any) => j.id_jabatan === user.id_jabatan);
      const departemen = departemenRes.data.find((d: any) => d.id_departemen === user.id_departemen);
      const role = roleRes.data.find((r: any) => r.id_role === user.id_role);

      setDetailData({
        jabatan: jabatan?.nama_jabatan || 'Unknown',
        departemen: departemen?.nama_departemen || 'Unknown',
        role: role?.nama_role || 'Unknown',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Gagal memuat detail data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPhotoUrl = () => {
    if (user?.foto_user) {
      return `http://localhost:8080/${user.foto_user}`;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Detail User</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap tentang user
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Foto User */}
            <div className="flex justify-center">
              {getPhotoUrl() ? (
                <img
                  src={getPhotoUrl()!}
                  alt={user?.nama_user}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-muted shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-muted flex items-center justify-center border-4 border-muted shadow-lg">
                  <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            <Separator />

            {/* Personal Info */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Informasi Personal</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">ID User:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-mono break-all">{user?.id_user}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Nama:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-semibold">{user?.nama_user}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Email:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm break-all">{user?.email}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">No. Telepon:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">{user?.phone_number}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">NIK:</span>
                <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm font-mono">{user?.nik}</span>
              </div>
            </div>

            <Separator />

            {/* Organization Info */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">Informasi Organisasi</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Jabatan:</span>
                <span className="col-span-1 sm:col-span-2">
                  <Badge variant="outline" className="text-xs">{detailData.jabatan}</Badge>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Departemen:</span>
                <span className="col-span-1 sm:col-span-2">
                  <Badge variant="outline" className="text-xs">{detailData.departemen}</Badge>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Role:</span>
                <span className="col-span-1 sm:col-span-2">
                  <Badge variant="secondary" className="text-xs">{detailData.role}</Badge>
                </span>
              </div>
            </div>

            {user?.created_at && (
              <>
                <Separator />
                
                {/* Timestamps */}
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Created:</span>
                    <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">{formatDate(user.created_at)}</span>
                  </div>

                  {user.updated_at && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">Updated:</span>
                      <span className="col-span-1 sm:col-span-2 text-xs sm:text-sm">{formatDate(user.updated_at)}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewUser;