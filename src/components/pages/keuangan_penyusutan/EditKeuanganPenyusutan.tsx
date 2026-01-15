import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  merek_aset: string;
  tipe_aset: string;
}

interface EditKeuanganPenyusutanProps {
  keuangan: KeuanganPenyusutan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const JENIS_AKUN_OPTIONS = [
  { value: "Aset", label: "Aset" },
  { value: "Beban", label: "Beban Penyusutan" },
  { value: "Akumulasi", label: "Akumulasi Penyusutan" },
];

const EditKeuanganPenyusutan: React.FC<EditKeuanganPenyusutanProps> = ({
  keuangan,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama_akun: "",
    kode_akun: "",
    jenis_akun: "",
    id_master_aset: "",
  });

  const [masterAsetList, setMasterAsetList] = useState<MasterAset[]>([]);
  useEffect(() => {
    const fetchMasterAset = async () => {
      try {
        const response = await api.get("/api/master-aset");
        setMasterAsetList(response.data);
      } catch (error) {
        console.error("Failed to fetch master aset:", error);
      }
    };

    if (open) {
      fetchMasterAset();
    }
  }, [open]);

  useEffect(() => {
    if (keuangan && open) {
      setFormData({
        nama_akun: keuangan.nama_akun,
        kode_akun: keuangan.kode_akun,
        jenis_akun: keuangan.jenis_akun,
        id_master_aset: keuangan.id_master_aset,
      });
    }
  }, [keuangan, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keuangan) return;

    setIsLoading(true);

    try {
      const payload = {
        nama_akun: formData.nama_akun.trim(),
        kode_akun: formData.kode_akun.trim(),
        jenis_akun: formData.jenis_akun,
        id_master_aset: formData.id_master_aset,
      };

      await api.put(
        `/api/keuangan-penyusutan/${keuangan.id_keuangan}`,
        payload
      );

      toast({
        title: "Success",
        description: "Akun keuangan berhasil diupdate",
      });

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Gagal mengupdate akun keuangan";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="text-lg sm:text-xl">Edit Akun Keuangan</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update informasi akun keuangan
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Kode Akun & Jenis Akun - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Kode Akun */}
              <div className="grid gap-2">
                <Label htmlFor="kode_akun" className="text-sm">
                  Kode Akun <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kode_akun"
                  value={formData.kode_akun}
                  onChange={(e) => handleInputChange("kode_akun", e.target.value)}
                  placeholder="Contoh: 1101"
                  required
                  disabled={isLoading}
                  className="text-sm font-mono"
                />
              </div>

              {/* Jenis Akun */}
              <div className="grid gap-2">
                <Label htmlFor="jenis_akun" className="text-sm">
                  Jenis Akun <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.jenis_akun}
                  onValueChange={(value) =>
                    handleInputChange("jenis_akun", value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Pilih jenis akun" />
                  </SelectTrigger>
                  <SelectContent>
                    {JENIS_AKUN_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-sm">
                        <span className="hidden sm:inline">{option.label}</span>
                        <span className="sm:hidden">{option.value}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nama Akun */}
            <div className="grid gap-2">
              <Label htmlFor="nama_akun" className="text-sm">
                Nama Akun <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_akun"
                value={formData.nama_akun}
                onChange={(e) => handleInputChange("nama_akun", e.target.value)}
                placeholder="Contoh: Aset Tetap - Gedung"
                required
                disabled={isLoading}
                className="text-sm"
              />
            </div>

            {/* Master Aset */}
            <div className="grid gap-2">
              <Label htmlFor="id_master_aset" className="text-sm">
                Master Aset <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.id_master_aset}
                onValueChange={(value) =>
                  handleInputChange("id_master_aset", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Pilih master aset" />
                </SelectTrigger>
                <SelectContent>
                  {masterAsetList.map((masterAset) => (
                    <SelectItem
                      key={masterAset.id_master_aset}
                      value={masterAset.id_master_aset}
                      className="text-sm"
                    >
                      <span className="hidden sm:inline">
                        {masterAset.kategori_aset} - {masterAset.tipe_aset}
                      </span>
                      <span className="sm:hidden">
                        {masterAset.kategori_aset}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Menyimpan..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditKeuanganPenyusutan;