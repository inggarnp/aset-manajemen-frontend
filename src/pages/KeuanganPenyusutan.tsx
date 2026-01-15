import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import TambahKeuanganPenyusutan from "@/components/pages/keuangan_penyusutan/TambahKeuanganPenyusutan";
import EditKeuanganPenyusutan from "@/components/pages/keuangan_penyusutan/EditKeuanganPenyusutan";
import ViewKeuanganPenyusutan from "@/components/pages/keuangan_penyusutan/ViewKeuanganPenyusutan";
import HapusKeuanganPenyusutan from "@/components/pages/keuangan_penyusutan/HapusKeuanganPenyusutan";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface KeuanganPenyusutan {
  id_keuangan: string;
  nama_akun: string;
  kode_akun: string;
  jenis_akun: string;
  id_master_aset: string;
  created_at: string;
  updated_at: string;
}

interface MasterAset {
  id_master_aset: string;
  kategori_aset: string;
  merek_aset: string;
  tipe_aset: string;
}

const KeuanganPenyusutan: React.FC = () => {
  const [keuanganList, setKeuanganList] = useState<KeuanganPenyusutan[]>([]);
  const [filteredData, setFilteredData] = useState<KeuanganPenyusutan[]>([]);
  const [masterAsetList, setMasterAsetList] = useState<MasterAset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    keuangan: KeuanganPenyusutan | null;
  }>({
    open: false,
    keuangan: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    keuangan: KeuanganPenyusutan | null;
  }>({
    open: false,
    keuangan: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    keuangan: KeuanganPenyusutan | null;
  }>({
    open: false,
    keuangan: null,
  });

  const fetchKeuangan = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/keuangan-penyusutan");
      const data = response.data || [];
      setKeuanganList(data);
      setFilteredData(data);
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Failed to fetch keuangan penyusutan";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setKeuanganList([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMasterAset = async () => {
    try {
      const response = await api.get("/api/master-aset");
      setMasterAsetList(response.data || []);
    } catch (error: any) {
      console.error("Failed to fetch master aset:", error);
      setMasterAsetList([]);
    }
  };

  useEffect(() => {
    const filtered = keuanganList.filter((keuangan) => {
      const searchLower = searchQuery.toLowerCase();
      const masterAset = masterAsetList.find(
        (ma) => ma.id_master_aset === keuangan.id_master_aset
      );
      return (
        keuangan.kode_akun.toLowerCase().includes(searchLower) ||
        keuangan.nama_akun.toLowerCase().includes(searchLower) ||
        keuangan.jenis_akun.toLowerCase().includes(searchLower) ||
        (masterAset?.kategori_aset.toLowerCase().includes(searchLower) || false)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, keuanganList, masterAsetList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (keuangan: KeuanganPenyusutan) => {
    setViewDialog({
      open: true,
      keuangan,
    });
  };

  const handleEdit = (keuangan: KeuanganPenyusutan) => {
    setEditDialog({
      open: true,
      keuangan,
    });
  };

  const handleDeleteClick = (keuangan: KeuanganPenyusutan) => {
    setDeleteDialog({
      open: true,
      keuangan,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchKeuangan();
    fetchMasterAset();
  }, []);

  const getJenisBadge = (jenis: string) => {
    const jenisMap: Record<string, { label: string; className: string }> = {
      'aset': { label: 'Aset', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
      'beban': { label: 'Beban', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800' },
      'akumulasi': { label: 'Akumulasi', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border border-orange-200 dark:border-orange-800' },
    };

    const config = jenisMap[jenis.toLowerCase()] || { label: jenis, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700' };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Keuangan Penyusutan
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Kelola akun-akun keuangan untuk penyusutan aset
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Daftar Akun Keuangan</CardTitle>
              <CardDescription className="text-sm">
                Chart of Accounts untuk penyusutan aset
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search keuangan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahKeuanganPenyusutan onSuccess={fetchKeuangan} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              Loading keuangan...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No keuangan found matching your search' : 'Belum ada akun keuangan'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Kode Akun</TableHead>
                          <TableHead className="whitespace-nowrap">Nama Akun</TableHead>
                          <TableHead className="whitespace-nowrap">Jenis Akun</TableHead>
                          <TableHead className="whitespace-nowrap hidden md:table-cell">Kategori Aset</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((keuangan) => {
                          const masterAset = masterAsetList.find(
                            (ma) => ma.id_master_aset === keuangan.id_master_aset
                          );

                          return (
                            <TableRow key={keuangan.id_keuangan}>
                              <TableCell className="font-mono font-semibold text-sm">
                                {keuangan.kode_akun}
                              </TableCell>
                              <TableCell className="font-medium text-sm min-w-[150px] sm:min-w-0">
                                <div>{keuangan.nama_akun}</div>
                                <div className="text-xs text-muted-foreground md:hidden">
                                  {masterAset?.kategori_aset || "-"}
                                </div>
                              </TableCell>
                              <TableCell>
                                {getJenisBadge(keuangan.jenis_akun)}
                              </TableCell>
                              <TableCell className="text-sm hidden md:table-cell">
                                {masterAset?.kategori_aset || "-"}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleView(keuangan)}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleEdit(keuangan)}
                                    >
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteClick(keuangan)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t mt-4">
                <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                  <span className="hidden sm:inline">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                  </span>
                  <span className="sm:hidden">
                    {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 sm:h-9"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      const showOnMobile = page === 1 || page === totalPages || page === currentPage;
                      const showOnDesktop = page === 1 || page === totalPages || 
                                           (page >= currentPage - 1 && page <= currentPage + 1);

                      if (showOnDesktop) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 p-0 ${!showOnMobile ? 'hidden sm:inline-flex' : ''}`}
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-1 hidden sm:inline">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 sm:h-9"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 sm:ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ViewKeuanganPenyusutan
        keuangan={viewDialog.keuangan}
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, keuangan: null })}
      />

      <EditKeuanganPenyusutan
        keuangan={editDialog.keuangan}
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, keuangan: null })}
        onSuccess={fetchKeuangan}
      />

      <HapusKeuanganPenyusutan
        keuangan={deleteDialog.keuangan}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, keuangan: null })}
        onSuccess={fetchKeuangan}
      />
    </div>
  );
};

export default KeuanganPenyusutan;