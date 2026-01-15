import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/api/axios";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface KeuanganPenyusutan {
  id_keuangan: string;
  nama_akun: string;
  kode_akun: string;
  jenis_akun: string;
  id_master_aset: string;
  created_at?: string;
  updated_at?: string;
}

interface MasterAset {
  id_master_aset: string;
  kategori_aset: string;
  merek_aset: string;
  tipe_aset: string;
}

interface ViewKeuanganPenyusutanProps {
  keuangan: KeuanganPenyusutan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewKeuanganPenyusutan: React.FC<ViewKeuanganPenyusutanProps> = ({
  keuangan,
  open,
  onOpenChange,
}) => {
  const [masterAset, setMasterAset] = React.useState<MasterAset | null>(null);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
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

  const getJenisBadge = (jenis: string) => {
    switch (jenis.toLowerCase()) {
      case "aset":
        return <Badge variant="default" className="text-xs">Aset</Badge>;
      case "beban":
        return <Badge variant="secondary" className="text-xs">Beban Penyusutan</Badge>;
      case "akumulasi":
        return <Badge variant="outline" className="text-xs">Akumulasi Penyusutan</Badge>;
      default:
        return <Badge className="text-xs">{jenis}</Badge>;
    }
  };

  const getJenisDescription = (jenis: string) => {
    switch (jenis.toLowerCase()) {
      case "aset":
        return "Akun untuk mencatat nilai aset tetap";
      case "beban":
        return "Akun untuk mencatat beban penyusutan periode berjalan";
      case "akumulasi":
        return "Akun untuk mencatat total penyusutan yang sudah terjadi";
      default:
        return jenis;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[550px] max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl">Detail Akun Keuangan</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap tentang akun keuangan penyusutan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* ID */}
          <div className="space-y-2">
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                ID Keuangan:
              </span>
              <span className="text-xs sm:text-sm font-mono break-all sm:col-span-2">
                {keuangan?.id_keuangan}
              </span>
            </div>
          </div>

          <Separator />

          {/* Informasi Akun */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">
              Informasi Akun
            </h4>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Kode Akun:
              </span>
              <span className="sm:col-span-2">
                <Badge variant="outline" className="font-mono font-bold text-xs">
                  {keuangan?.kode_akun}
                </Badge>
              </span>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Nama Akun:
              </span>
              <span className="text-xs sm:text-sm font-semibold sm:col-span-2 break-words">
                {keuangan?.nama_akun}
              </span>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Jenis Akun:
              </span>
              <span className="sm:col-span-2">
                {keuangan && getJenisBadge(keuangan.jenis_akun)}
              </span>
            </div>

            <div className="bg-muted/50 rounded-lg p-2 sm:p-3">
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {getJenisDescription(keuangan?.jenis_akun || "")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Master Aset */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="font-semibold text-xs sm:text-sm text-muted-foreground">
              Master Aset
            </h4>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Kategori:
              </span>
              <span className="sm:col-span-2">
                <Badge variant="secondary" className="text-xs">
                  {masterAset?.kategori_aset || "-"}
                </Badge>
              </span>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Merek:
              </span>
              <span className="text-xs sm:text-sm sm:col-span-2">
                {masterAset?.merek_aset || "-"}
              </span>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Tipe:
              </span>
              <span className="text-xs sm:text-sm sm:col-span-2">
                {masterAset?.tipe_aset || "-"}
              </span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-2 sm:p-3">
              <p className="text-[10px] sm:text-xs text-blue-800 dark:text-blue-200">
                Akun ini digunakan untuk mencatat transaksi penyusutan aset
                kategori <strong className="font-bold">{masterAset?.kategori_aset}</strong>
              </p>
            </div>
          </div>

          {keuangan?.created_at && (
            <>
              <Separator />

              {/* Timestamps */}
              <div className="space-y-2">
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Created:
                  </span>
                  <span className="text-xs sm:text-sm sm:col-span-2">
                    {formatDate(keuangan.created_at)}
                  </span>
                </div>

                {keuangan.updated_at && (
                  <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Updated:
                    </span>
                    <span className="text-xs sm:text-sm sm:col-span-2">
                      {formatDate(keuangan.updated_at)}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Example Usage */}
          <Separator />
          <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
            <h5 className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-2">
              Contoh Jurnal Penyusutan
            </h5>
            <div className="text-[10px] sm:text-xs space-y-1 font-mono">
              <p className="break-words">Dr. Beban Penyusutan - {masterAset?.kategori_aset}</p>
              <p className="ml-4 break-words">
                Cr. Akumulasi Penyusutan - {masterAset?.kategori_aset}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewKeuanganPenyusutan;