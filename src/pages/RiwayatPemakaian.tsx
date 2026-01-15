import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import TambahRiwayatPemakaian from '@/components/pages/riwayat_pemakaian/TambahRiwayatPemakaian';
import EditRiwayatPemakaian from '@/components/pages/riwayat_pemakaian/EditRiwayatPemakaian';
import ViewRiwayatPemakaian from '@/components/pages/riwayat_pemakaian/ViewRiwayatPemakaian';
import HapusRiwayatPemakaian from '@/components/pages/riwayat_pemakaian/HapusRiwayatPemakaian';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface RiwayatPemakaian {
  id_riwayat: string;
  id_aset: string;
  id_user: string;
  tanggal_mulai_pakai: string;
  tanggal_selesai_pakai: string | null;
  lokasi_pemakaian: string;
  kondisi_aset: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
}

interface Aset {
  id_aset: string;
  kode_aset: string;
  nama_aset: string;
}

interface User {
  id_user: string;
  nama_user: string;
  email: string;
}

const RiwayatPemakaian: React.FC = () => {
  const [riwayatList, setRiwayatList] = useState<RiwayatPemakaian[]>([]);
  const [filteredData, setFilteredData] = useState<RiwayatPemakaian[]>([]);
  const [asetList, setAsetList] = useState<Aset[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    riwayat: RiwayatPemakaian | null;
  }>({
    open: false,
    riwayat: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    riwayat: RiwayatPemakaian | null;
  }>({
    open: false,
    riwayat: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    riwayat: RiwayatPemakaian | null;
  }>({
    open: false,
    riwayat: null,
  });

  const fetchRiwayat = async () => {
    try {
      setIsLoading(true);
      const [riwayatRes, asetRes, userRes] = await Promise.all([
        api.get('/api/riwayat-pemakaian'),
        api.get('/api/aset'),
        api.get('/api/users'),
      ]);
      const data = Array.isArray(riwayatRes.data) ? riwayatRes.data : [];
      setRiwayatList(data);
      setFilteredData(data);
      setAsetList(Array.isArray(asetRes.data) ? asetRes.data : []);
      setUserList(Array.isArray(userRes.data) ? userRes.data : []);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch riwayat pemakaian';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setRiwayatList([]);
      setFilteredData([]);
      setAsetList([]);
      setUserList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Export Excel Function
  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      
      const response = await api.get('/api/riwayat-pemakaian/export/excel', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `riwayat_pemakaian_${date}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({
        title: 'Success',
        description: 'Data berhasil diekspor ke Excel',
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Gagal mengekspor data';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const filtered = riwayatList.filter((riwayat) => {
      const searchLower = searchQuery.toLowerCase();
      const aset = asetList.find(a => a.id_aset === riwayat.id_aset);
      const user = userList.find(u => u.id_user === riwayat.id_user);
      
      return (
        (aset?.nama_aset.toLowerCase().includes(searchLower) || false) ||
        (aset?.kode_aset.toLowerCase().includes(searchLower) || false) ||
        (user?.nama_user.toLowerCase().includes(searchLower) || false) ||
        riwayat.lokasi_pemakaian.toLowerCase().includes(searchLower) ||
        riwayat.kondisi_aset.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, riwayatList, asetList, userList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (riwayat: RiwayatPemakaian) => {
    setViewDialog({
      open: true,
      riwayat,
    });
  };

  const handleEdit = (riwayat: RiwayatPemakaian) => {
    setEditDialog({
      open: true,
      riwayat,
    });
  };

  const handleDeleteClick = (riwayat: RiwayatPemakaian) => {
    setDeleteDialog({
      open: true,
      riwayat,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getKondisiBadge = (kondisi: string) => {
    const kondisiMap: Record<string, { label: string; className: string }> = {
      'baik': { label: 'Baik', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border border-green-200 dark:border-green-800' },
      'rusak ringan': { label: 'Rusak Ringan', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800' },
      'rusak berat': { label: 'Rusak Berat', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border border-red-200 dark:border-red-800' },
    };

    const config = kondisiMap[kondisi.toLowerCase()] || { label: kondisi, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700' };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (tanggalSelesai: string | null) => {
    if (!tanggalSelesai) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 whitespace-nowrap">
          Sedang Dipakai
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 whitespace-nowrap">
        Selesai Dipakai
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Riwayat Pemakaian</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Kelola riwayat pemakaian aset</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Daftar Riwayat Pemakaian</CardTitle>
              <CardDescription className="text-sm">Semua riwayat pemakaian aset yang terdaftar</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search riwayat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleExportExcel}
                  disabled={isExporting || filteredData.length === 0}
                  className="flex-1 sm:flex-none"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export Excel'}
                </Button>
                <TambahRiwayatPemakaian onSuccess={fetchRiwayat} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">Loading riwayat...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No riwayat found matching your search' : 'Belum ada riwayat pemakaian'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="whitespace-nowrap">Nama Aset</TableHead>
                          <TableHead className="whitespace-nowrap hidden md:table-cell">Nama User</TableHead>
                          <TableHead className="whitespace-nowrap hidden lg:table-cell">Tanggal Mulai</TableHead>
                          <TableHead className="whitespace-nowrap hidden lg:table-cell">Tanggal Selesai</TableHead>
                          <TableHead className="whitespace-nowrap hidden xl:table-cell">Lokasi</TableHead>
                          <TableHead className="whitespace-nowrap">Kondisi</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((riwayat) => {
                          const aset = asetList.find(a => a.id_aset === riwayat.id_aset);
                          const user = userList.find(u => u.id_user === riwayat.id_user);
                          
                          return (
                            <TableRow key={riwayat.id_riwayat}>
                              <TableCell>{getStatusBadge(riwayat.tanggal_selesai_pakai)}</TableCell>
                              <TableCell className="min-w-[150px] sm:min-w-0">
                                <div className="font-medium text-sm">{aset?.nama_aset || '-'}</div>
                                <div className="text-xs text-muted-foreground">{aset?.kode_aset || '-'}</div>
                                <div className="text-xs text-muted-foreground md:hidden">{user?.nama_user || '-'}</div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="font-medium text-sm">{user?.nama_user || '-'}</div>
                                <div className="text-xs text-muted-foreground">{user?.email || '-'}</div>
                              </TableCell>
                              <TableCell className="text-sm hidden lg:table-cell">{formatDate(riwayat.tanggal_mulai_pakai)}</TableCell>
                              <TableCell className="text-sm hidden lg:table-cell">{formatDate(riwayat.tanggal_selesai_pakai)}</TableCell>
                              <TableCell className="text-sm hidden xl:table-cell">{riwayat.lokasi_pemakaian}</TableCell>
                              <TableCell>
                                {getKondisiBadge(riwayat.kondisi_aset)}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleView(riwayat)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEdit(riwayat)}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteClick(riwayat)}
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

      <ViewRiwayatPemakaian
        riwayat={viewDialog.riwayat}
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, riwayat: null })}
      />

      <EditRiwayatPemakaian
        riwayat={editDialog.riwayat}
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, riwayat: null })}
        onSuccess={fetchRiwayat}
      />

      <HapusRiwayatPemakaian
        riwayat={deleteDialog.riwayat}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, riwayat: null })}
        onSuccess={fetchRiwayat}
      /> 
    </div>
  );
};

export default RiwayatPemakaian;