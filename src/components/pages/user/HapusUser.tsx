import React, { useState } from 'react';
import api from '@/api/axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { User as UserIcon } from 'lucide-react';

interface User {
  id_user: string;
  nama_user: string;
  email: string;
  foto_user?: string | null;
}

interface HapusUserProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const HapusUser: React.FC<HapusUserProps> = ({ user, open, onOpenChange, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      await api.delete(`/api/users/${user.id_user}`);
      
      toast({
        title: 'Success',
        description: 'User berhasil dihapus',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal menghapus user';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPhotoUrl = () => {
    if (user?.foto_user) {
      return `http://localhost:8080/${user.foto_user}`;
    }
    return null;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base sm:text-lg">Hapus User</AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm space-y-2 sm:space-y-3">
            <p>Apakah Anda yakin ingin menghapus user berikut?</p>
            
            <div className="space-y-2 sm:space-y-3 bg-muted/50 p-3 sm:p-4 rounded-lg">
              {/* Foto User */}
              <div className="flex justify-center">
                {getPhotoUrl() ? (
                  <img
                    src={getPhotoUrl()!}
                    alt={user?.nama_user}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-muted"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center border-2 border-muted">
                    <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="space-y-1 text-xs sm:text-sm text-center">
                <div className="font-semibold text-base sm:text-lg text-foreground">{user?.nama_user}</div>
                <div className="text-muted-foreground break-all">{user?.email}</div>
                <div className="text-xs pt-1 sm:pt-2">
                  <code className="bg-muted px-2 py-1 rounded text-xs break-all">{user?.id_user}</code>
                </div>
              </div>
            </div>
            
            <p className="text-destructive font-semibold text-xs sm:text-sm">
               Perhatian: Tindakan ini tidak dapat dibatalkan!
            </p>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Semua data user akan dihapus secara permanen</p>
              <p>• Foto user akan dihapus dari server</p>
              <p>• Riwayat aktivitas user akan hilang</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel 
            disabled={isLoading}
            className="w-full sm:w-auto order-2 sm:order-1 mt-0"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto order-1 sm:order-2 bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? 'Menghapus...' : 'Hapus User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HapusUser;