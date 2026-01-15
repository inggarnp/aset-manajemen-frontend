import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import TambahMasterAset from '@/components/pages/master_aset/TambahMasterAset';
import EditMasterAset from '@/components/pages/master_aset/EditMasterAset';
import ViewMasterAset from '@/components/pages/master_aset/ViewMasterAset';
import HapusMasterAset from '@/components/pages/master_aset/HapusMasterAset';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

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
  created_at: string;
  updated_at: string;
}

const MasterAset: React.FC = () => {
  const [masterAsetList, setMasterAsetList] = useState<MasterAset[]>([]);
  const [filteredData, setFilteredData] = useState<MasterAset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    masterAset: MasterAset | null;
  }>({
    open: false,
    masterAset: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    masterAset: MasterAset | null;
  }>({
    open: false,
    masterAset: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    masterAset: MasterAset | null;
  }>({
    open: false,
    masterAset: null,
  });

  const fetchMasterAset = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/master-aset');
      const data = Array.isArray(response.data) ? response.data : [];
      setMasterAsetList(data);
      setFilteredData(data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch master aset';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setMasterAsetList([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = masterAsetList.filter((ma) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        ma.nama_kategori?.toLowerCase().includes(searchLower) ||
        ma.nama_merek?.toLowerCase().includes(searchLower) ||
        ma.nama_tipe?.toLowerCase().includes(searchLower) ||
        ma.metode_penyusutan.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, masterAsetList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (masterAset: MasterAset) => {
    setViewDialog({
      open: true,
      masterAset,
    });
  };

  const handleEdit = (masterAset: MasterAset) => {
    setEditDialog({
      open: true,
      masterAset,
    });
  };

  const handleDeleteClick = (masterAset: MasterAset) => {
    setDeleteDialog({
      open: true,
      masterAset,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchMasterAset();
  }, []);

  const getMetodeBadge = (metode: string) => {
    const metodeMap: Record<string, { label: string; className: string }> = {
      'straight-line': { label: 'Straight-Line', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      'garis lurus': { label: 'Garis Lurus', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      'declining balance': { label: 'Declining Balance', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
      'saldo menurun': { label: 'Saldo Menurun', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
      'sum of years': { label: 'Sum of Years', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      'jumlah angka tahun': { label: 'Jumlah Angka Tahun', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    };

    const config = metodeMap[metode.toLowerCase()] || { label: metode, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Master Aset</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Kelola kategori dan spesifikasi aset</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Daftar Master Aset</CardTitle>
              <CardDescription className="text-sm">Semua kategori aset yang terdaftar di sistem</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search master aset..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahMasterAset onSuccess={fetchMasterAset} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">Loading master aset...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No master aset found matching your search' : 'Belum ada master aset'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Kategori</TableHead>
                          <TableHead className="whitespace-nowrap">Merek</TableHead>
                          <TableHead className="whitespace-nowrap hidden md:table-cell">Tipe</TableHead>
                          <TableHead className="whitespace-nowrap hidden lg:table-cell">Umur Ekonomis</TableHead>
                          <TableHead className="whitespace-nowrap">Metode</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((masterAset) => (
                          <TableRow key={masterAset.id_master_aset}>
                            <TableCell className="font-medium text-sm">{masterAset.nama_kategori}</TableCell>
                            <TableCell className="text-sm min-w-[120px] sm:min-w-0">
                              <div>{masterAset.nama_merek}</div>
                              <div className="text-xs text-muted-foreground md:hidden">{masterAset.nama_tipe}</div>
                            </TableCell>
                            <TableCell className="text-sm hidden md:table-cell">{masterAset.nama_tipe}</TableCell>
                            <TableCell className="text-sm hidden lg:table-cell">{masterAset.umur_ekonomis} tahun</TableCell>
                            <TableCell>
                              {getMetodeBadge(masterAset.metode_penyusutan)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleView(masterAset)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(masterAset)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(masterAset)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t mt-4">
                <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                  <span className="hidden sm:inline">Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries</span>
                  <span className="sm:hidden">{startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}</span>
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
                      const showOnDesktop = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);
                      
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

      <ViewMasterAset
        masterAset={viewDialog.masterAset}
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, masterAset: null })}
      />

      <EditMasterAset
        masterAset={editDialog.masterAset}
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, masterAset: null })}
        onSuccess={fetchMasterAset}
      />

      <HapusMasterAset
        masterAset={deleteDialog.masterAset}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, masterAset: null })}
        onSuccess={fetchMasterAset}
      />
    </div>
  );
};

export default MasterAset;