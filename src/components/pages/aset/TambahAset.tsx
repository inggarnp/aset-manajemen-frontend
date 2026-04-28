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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface TambahAsetProps {
  onSuccess: () => void;
}

interface MasterAset {
  id_master_aset: string;
  id_kategori: string;
  id_merek: string;
  id_tipe: string;
  nama_kategori: string;
  nama_merek: string;
  nama_tipe: string;
  umur_ekonomis: number;
  metode_penyusutan: string;
}

const TambahAset: React.FC<TambahAsetProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [masterAsetList, setMasterAsetList] = useState<MasterAset[]>([]);
  const [isNamaAsetManual, setIsNamaAsetManual] = useState(false);
  const [formData, setFormData] = useState({
    kode_aset: "",
    nama_aset: "",
    serial_number: "",
    tanggal_pembelian: "",
    harga_beli: "",
    id_master_aset: "",
    status_aset: "tersedia",
    aksesoris: "",
  });

  useEffect(() => {
    if (open) {
      fetchMasterAset();
    }
  }, [open]);

  const fetchMasterAset = async () => {
    try {
      const response = await api.get("/api/master-aset");
      setMasterAsetList(response.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load master aset",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        harga_beli: parseFloat(formData.harga_beli),
      };

      await api.post("/api/aset", payload);

      toast({
        title: "Success",
        description: "Aset berhasil ditambahkan",
      });

      setFormData({
        kode_aset: "",
        nama_aset: "",
        serial_number: "",
        tanggal_pembelian: "",
        harga_beli: "",
        id_master_aset: "",
        status_aset: "tersedia",
        aksesoris: "",
      });

      setOpen(false);
      onSuccess();
    } catch (error: any) {
      const message = error.response?.data?.error || "Gagal menambahkan aset";
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
          <span className="hidden sm:inline">Tambah Aset</span>
          <span className="sm:hidden">Tambah</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Tambah Aset
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Tambahkan aset baru ke dalam sistem
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            {/* Kode & Nama - 2 kolom di desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="kode_aset" className="text-sm">
                  Kode Aset <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kode_aset"
                  value={formData.kode_aset}
                  onChange={(e) => handleChange("kode_aset", e.target.value)}
                  placeholder="AST-001"
                  required
                  className="text-sm"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nama_aset" className="text-sm">
                  Nama Aset <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama_aset"
                  value={formData.nama_aset}
                  onChange={(e) => {
                    setIsNamaAsetManual(true);
                    handleChange("nama_aset", e.target.value);
                  }}
                  placeholder="Laptop Dell"
                  required
                />
              </div>
            </div>

            {/* Serial Number & Kategori - 2 kolom di desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serial_number" className="text-sm">
                  Serial Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="serial_number"
                  value={formData.serial_number}
                  onChange={(e) =>
                    handleChange("serial_number", e.target.value)
                  }
                  placeholder="SN123456789"
                  required
                  className="text-sm font-mono"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="id_master_aset" className="text-sm">
                  Kategori Aset <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.id_master_aset}
                  onValueChange={(value) => {
                    handleChange("id_master_aset", value);

                    if (!isNamaAsetManual) {
                      const selected = masterAsetList.find(
                        (m) => String(m.id_master_aset) === String(value),
                      );

                      if (selected) {
                        const autoName = `${selected.nama_kategori} ${selected.nama_merek} ${selected.nama_tipe}`;
                        handleChange("nama_aset", autoName);
                      }
                    }
                  }}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {masterAsetList.map((master) => (
                      <SelectItem
                        key={master.id_master_aset}
                        value={master.id_master_aset}
                        className="text-sm"
                      >
                        <span className="block sm:hidden">
                          {master.nama_kategori}
                        </span>
                        <span className="hidden sm:block">
                          {master.nama_kategori} - {master.nama_merek} (
                          {master.nama_tipe})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Pilih kombinasi kategori, merek, dan tipe aset
                </p>
              </div>
            </div>

            {/* Tanggal & Harga - 2 kolom di desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tanggal_pembelian" className="text-sm">
                  Tanggal Pembelian <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tanggal_pembelian"
                  type="date"
                  value={formData.tanggal_pembelian}
                  onChange={(e) =>
                    handleChange("tanggal_pembelian", e.target.value)
                  }
                  required
                  className="text-sm"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="harga_beli" className="text-sm">
                  Harga Beli <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="harga_beli"
                  type="number"
                  value={formData.harga_beli}
                  onChange={(e) => handleChange("harga_beli", e.target.value)}
                  placeholder="15000000"
                  required
                  min="0"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status_aset" className="text-sm">
                Status Aset <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status_aset}
                onValueChange={(value) => handleChange("status_aset", value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tersedia" className="text-sm">
                    Tersedia
                  </SelectItem>
                  <SelectItem value="digunakan" className="text-sm">
                    Digunakan
                  </SelectItem>
                  <SelectItem value="maintenance" className="text-sm">
                    Maintenance
                  </SelectItem>
                  <SelectItem value="rusak" className="text-sm">
                    Rusak
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aksesoris - NEW FIELD */}
            <div className="grid gap-2">
              <Label htmlFor="aksesoris" className="text-sm">
                Aksesoris{" "}
                <span className="text-xs text-muted-foreground">
                  (Opsional)
                </span>
              </Label>
              <Textarea
                id="aksesoris"
                value={formData.aksesoris}
                onChange={(e) => handleChange("aksesoris", e.target.value)}
                placeholder="Contoh: CPU Intel i7, RAM 16GB DDR4, Mouse Logitech, Keyboard Mechanical"
                rows={3}
                className="text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Tuliskan kelengkapan aset seperti CPU, RAM, keyboard, mouse, dll
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
              {isLoading ? "Menyimpan..." : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TambahAset;
