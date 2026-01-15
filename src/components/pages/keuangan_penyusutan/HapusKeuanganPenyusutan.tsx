import React, { useState } from "react";
import api from "@/api/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface KeuanganPenyusutan {
  id_keuangan: string;
  nama_akun: string;
  kode_akun: string;
  jenis_akun: string;
  id_master_aset: string;
}

interface MasterAset {
  id_master_aset: string;
  kategori_aset: string;
  tipe_aset: string;
}

interface HapusKeuanganPenyusutanProps {
  keuangan: KeuanganPenyusutan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const HapusKeuanganPenyusutan: React.FC<HapusKeuanganPenyusutanProps> = ({
  keuangan,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [masterAset, setMasterAset] = React.useState<MasterAset | null>(null);

  React.useEffect(() => {
    const fetchMasterAset = async () => {
      if (keuangan?.id_master_aset) {
        try {
          const response = await api.get("/api/master-aset");
          const found = response.data.find(
            (ma: MasterAset) => ma.id_master_aset === keuangan.id_master_aset
          );
          setMasterAset(found || null);
        } catch (error) {
          console.error("Failed to fetch master aset:", error);
        }
      }
    };

    if (open) {
      fetchMasterAset();
    }
  }, [keuangan, open]);

  const handleDelete = async () => {
    if (!keuangan) return;

    setIsLoading(true);

    try {
      await api.delete(`/api/keuangan-penyusutan/${keuangan.id_keuangan}`);

      toast({
        title: "Success",
        description: "Akun keuangan berhasil dihapus",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Gagal menghapus akun keuangan";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[95vw] max-w-[500px] p-4 sm:p-6">
        <AlertDialogHeader className="space-y-2 sm:space-y-3">
          <AlertDialogTitle className="text-lg sm:text-xl">Hapus Akun Keuangan</AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm space-y-3 sm:space-y-4">
            <p>Apakah Anda yakin ingin menghapus akun keuangan berikut?</p>
            
            <div className="space-y-2 bg-muted/50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
              {/* Kode Akun */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="font-semibold min-w-[90px]">Kode Akun:</span>
                <span className="font-mono font-bold break-all flex-1">
                  {keuangan?.kode_akun}
                </span>
              </div>
              
              {/* Nama Akun */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="font-semibold min-w-[90px]">Nama Akun:</span>
                <span className="break-words flex-1">{keuangan?.nama_akun}</span>
              </div>
              
              {/* Jenis */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="font-semibold min-w-[90px]">Jenis:</span>
                <span className="flex-1">{keuangan?.jenis_akun}</span>
              </div>
              
              {/* Kategori */}
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="font-semibold min-w-[90px]">Kategori:</span>
                <span className="flex-1">{masterAset?.kategori_aset || "-"}</span>
              </div>
              
              {/* ID */}
              <div className="text-[10px] sm:text-xs text-muted-foreground pt-2 border-t">
                ID:{" "}
                <code className="bg-muted px-1 rounded break-all">
                  {keuangan?.id_keuangan}
                </code>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-destructive font-semibold text-xs sm:text-sm">
                ⚠️ Perhatian: Tindakan ini tidak dapat dibatalkan!
              </p>
              <div className="text-[10px] sm:text-xs text-muted-foreground space-y-1">
                <p>• Akun ini akan dihapus dari chart of accounts</p>
                <p>
                  • Transaksi penyusutan yang sudah ada mungkin akan terpengaruh
                </p>
                <p>
                  • Pastikan tidak ada transaksi aktif yang menggunakan akun ini
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 flex-col-reverse sm:flex-row">
          <AlertDialogCancel disabled={isLoading} className="w-full sm:w-auto">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
          >
            {isLoading ? "Menghapus..." : "Hapus Akun"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HapusKeuanganPenyusutan;