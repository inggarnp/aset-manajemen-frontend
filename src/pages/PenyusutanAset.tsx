import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import TambahPenyusutanAset from '@/components/pages/penyusutan_aset/TambahPenyusutanAset';
import EditPenyusutanAset from '@/components/pages/penyusutan_aset/EditPenyusutanAset';
import ViewPenyusutanAset from '@/components/pages/penyusutan_aset/ViewPenyusutanAset';
import HapusPenyusutanAset from '@/components/pages/penyusutan_aset/HapusPenyusutanAset';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface PenyusutanAset {
  id_penyusutan: string;
  id_aset: string;
  id_keuangan: string;
  periode_penyusutan: string;
  nilai_penyusutan: number;
  nilai_buku: number;
  akumulasi_penyusutan: number;
  tanggal_perhitungan: string;
  created_at: string;
  updated_at: string;
}

interface Aset {
  id_aset: string;
  kode_aset: string;
  nama_aset: string;
}

const PenyusutanAset: React.FC = () => {
  const [penyusutanList, setPenyusutanList] = useState<PenyusutanAset[]>([]);
  const [filteredData, setFilteredData] = useState<PenyusutanAset[]>([]);
  const [asetList, setAsetList] = useState<Aset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    penyusutan: PenyusutanAset | null;
  }>({
    open: false,
    penyusutan: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    penyusutan: PenyusutanAset | null;
  }>({
    open: false,
    penyusutan: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    penyusutan: PenyusutanAset | null;
  }>({
    open: false,
    penyusutan: null,
  });

  const fetchPenyusutan = async () => {
    try {
      setIsLoading(true);
      const [penyusutanRes, asetRes] = await Promise.all([
        api.get('/api/penyusutan-aset'),
        api.get('/api/aset'),
      ]);
      const data = Array.isArray(penyusutanRes.data) ? penyusutanRes.data : [];
      setPenyusutanList(data);
      setFilteredData(data);
      setAsetList(Array.isArray(asetRes.data) ? asetRes.data : []);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch penyusutan aset';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setPenyusutanList([]);
      setFilteredData([]);
      setAsetList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = penyusutanList.filter((penyusutan) => {
      const searchLower = searchQuery.toLowerCase();
      const aset = asetList.find(a => a.id_aset === penyusutan.id_aset);
      return (
        (aset?.nama_aset.toLowerCase().includes(searchLower) || false) ||
        (aset?.kode_aset.toLowerCase().includes(searchLower) || false) ||
        penyusutan.periode_penyusutan.toLowerCase().includes(searchLower) ||
        penyusutan.id_keuangan.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, penyusutanList, asetList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (penyusutan: PenyusutanAset) => {
    setViewDialog({
      open: true,
      penyusutan,
    });
  };

  const handleEdit = (penyusutan: PenyusutanAset) => {
    setEditDialog({
      open: true,
      penyusutan,
    });
  };

  const handleDeleteClick = (penyusutan: PenyusutanAset) => {
    setDeleteDialog({
      open: true,
      penyusutan,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchPenyusutan();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Penyusutan Aset</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Kelola perhitungan penyusutan aset tetap</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Daftar Penyusutan Aset</CardTitle>
              <CardDescription className="text-sm">Riwayat perhitungan penyusutan per periode</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search penyusutan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahPenyusutanAset onSuccess={fetchPenyusutan} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">Loading penyusutan...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No penyusutan found matching your search' : 'Belum ada data penyusutan'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Periode</TableHead>
                          <TableHead className="whitespace-nowrap">Nama Aset</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Nilai Penyusutan</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Nilai Buku</TableHead>
                          <TableHead className="text-right whitespace-nowrap hidden md:table-cell">Akumulasi</TableHead>
                          <TableHead className="whitespace-nowrap hidden lg:table-cell">Tanggal</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((penyusutan) => {
                          const aset = asetList.find(a => a.id_aset === penyusutan.id_aset);
                          
                          return (
                            <TableRow key={penyusutan.id_penyusutan}>
                              <TableCell>
                                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 whitespace-nowrap">
                                  {penyusutan.periode_penyusutan}
                                </span>
                              </TableCell>
                              <TableCell className="min-w-[150px] sm:min-w-0">
                                <div className="font-medium text-sm">{aset?.nama_aset || '-'}</div>
                                <div className="text-xs text-muted-foreground">{aset?.kode_aset || '-'}</div>
                              </TableCell>
                              <TableCell className="text-right font-semibold text-red-600 text-xs sm:text-sm whitespace-nowrap">
                                {formatCurrency(penyusutan.nilai_penyusutan)}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-blue-600 text-xs sm:text-sm whitespace-nowrap">
                                {formatCurrency(penyusutan.nilai_buku)}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-orange-600 text-xs sm:text-sm hidden md:table-cell whitespace-nowrap">
                                {formatCurrency(penyusutan.akumulasi_penyusutan)}
                              </TableCell>
                              <TableCell className="text-sm hidden lg:table-cell">{formatDate(penyusutan.tanggal_perhitungan)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleView(penyusutan)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEdit(penyusutan)}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteClick(penyusutan)}
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

      <ViewPenyusutanAset
        penyusutan={viewDialog.penyusutan}
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, penyusutan: null })}
      />

      <EditPenyusutanAset
        penyusutan={editDialog.penyusutan}
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, penyusutan: null })}
        onSuccess={fetchPenyusutan}
      />

      <HapusPenyusutanAset
        penyusutan={deleteDialog.penyusutan}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, penyusutan: null })}
        onSuccess={fetchPenyusutan}
      />
    </div>
  );
};

export default PenyusutanAset;