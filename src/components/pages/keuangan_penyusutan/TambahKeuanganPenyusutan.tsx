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
  DialogTrigger,
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
import { Plus } from "lucide-react";

interface TambahKeuanganPenyusutanProps {
  onSuccess: () => void;
}

interface FormData {
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

const JENIS_AKUN_OPTIONS = [
  { value: "Aset", label: "Aset" },
  { value: "Beban", label: "Beban Penyusutan" },
  { value: "Akumulasi", label: "Akumulasi Penyusutan" },
];

const TambahKeuanganPenyusutan: React.FC<TambahKeuanganPenyusutanProps> = ({
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
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

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.kode_akun.trim()) {
      toast({
        title: "Validation Error",
        description: "Kode akun harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.nama_akun.trim()) {
      toast({
        title: "Validation Error",
        description: "Nama akun harus diisi",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.jenis_akun) {
      toast({
        title: "Validation Error",
        description: "Jenis akun harus dipilih",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.id_master_aset) {
      toast({
        title: "Validation Error",
        description: "Master aset harus dipilih",
        variant: "destructive",
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

      const payload = {
        nama_akun: formData.nama_akun.trim(),
        kode_akun: formData.kode_akun.trim(),
        jenis_akun: formData.jenis_akun,
        id_master_aset: formData.id_master_aset,
      };

      await api.post("/api/keuangan-penyusutan", payload);

      toast({
        title: "Success",
        description: "Akun keuangan berhasil ditambahkan",
      });

      // Reset form
      setFormData({
        nama_akun: "",
        kode_akun: "",
        jenis_akun: "",
        id_master_aset: "",
      });

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Failed to create akun keuangan";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Tambah Akun</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="text-lg sm:text-xl">Tambah Akun Keuangan</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Isi form di bawah untuk menambahkan akun keuangan baru
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Kode Akun & Nama Akun - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Kode Akun */}
              <div className="grid gap-2">
                <Label htmlFor="kode_akun" className="text-sm">
                  Kode Akun <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kode_akun"
                  placeholder="1101"
                  value={formData.kode_akun}
                  onChange={(e) => handleInputChange("kode_akun", e.target.value)}
                  disabled={isLoading}
                  className="text-sm font-mono"
                />
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Kode unik akun
                </p>
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
                    <SelectValue placeholder="Pilih jenis" />
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
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Klasifikasi akun
                </p>
              </div>
            </div>

            {/* Nama Akun */}
            <div className="grid gap-2">
              <Label htmlFor="nama_akun" className="text-sm">
                Nama Akun <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_akun"
                placeholder="Aset Tetap - Gedung"
                value={formData.nama_akun}
                onChange={(e) => handleInputChange("nama_akun", e.target.value)}
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
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Pilih master aset terkait
              </p>
            </div>

            {/* Info Box - Responsive */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
              <h4 className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                ℹ️ Contoh Struktur Akun
              </h4>
              <div className="text-[10px] sm:text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <p>
                  <strong>Aset:</strong> 1101 - Komputer
                </p>
                <p>
                  <strong>Akumulasi:</strong> 1102 - Akum. Penyusutan
                </p>
                <p>
                  <strong>Beban:</strong> 5101 - Beban Penyusutan
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahKeuanganPenyusutan;