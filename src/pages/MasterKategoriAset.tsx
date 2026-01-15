import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import TambahMasterKategoriAset from '@/components/pages/master_kategori_aset/TambahMasterKategoriAset';
import EditMasterKategoriAset from '@/components/pages/master_kategori_aset/EditMasterKategoriAset';
import ViewMasterKategoriAset from '@/components/pages/master_kategori_aset/ViewMasterKategoriAset';
import HapusMasterKategoriAset from '@/components/pages/master_kategori_aset/HapusMasterKategoriAset';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface MasterKategoriAset {
  id_kategori: string;
  nama_kategori: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
}

const MasterKategoriAset: React.FC = () => {
  const [kategoriList, setKategoriList] = useState<MasterKategoriAset[]>([]);
  const [filteredData, setFilteredData] = useState<MasterKategoriAset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    kategori: MasterKategoriAset | null;
  }>({
    open: false,
    kategori: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    kategori: MasterKategoriAset | null;
  }>({
    open: false,
    kategori: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    kategori: MasterKategoriAset | null;
  }>({
    open: false,
    kategori: null,
  });

  const fetchKategori = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/master-kategori-aset');
      const data = Array.isArray(response.data) ? response.data : [];
      setKategoriList(data);
      setFilteredData(data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch master kategori';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setKategoriList([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = kategoriList.filter((k) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        k.nama_kategori.toLowerCase().includes(searchLower) ||
        k.keterangan.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, kategoriList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (kategori: MasterKategoriAset) => {
    setViewDialog({ open: true, kategori });
  };

  const handleEdit = (kategori: MasterKategoriAset) => {
    setEditDialog({ open: true, kategori });
  };

  const handleDeleteClick = (kategori: MasterKategoriAset) => {
    setDeleteDialog({ open: true, kategori });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Master Kategori Aset</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Kelola kategori aset yang tersedia</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Daftar Kategori</CardTitle>
              <CardDescription className="text-sm">Semua kategori aset yang terdaftar</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahMasterKategoriAset onSuccess={fetchKategori} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No kategori found' : 'Belum ada kategori'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Nama Kategori</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">Keterangan</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((kategori) => (
                      <TableRow key={kategori.id_kategori}>
                        <TableCell className="font-medium text-sm">{kategori.nama_kategori}</TableCell>
                        <TableCell className="text-sm hidden md:table-cell">
                          {kategori.keterangan || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(kategori)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(kategori)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(kategori)}
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

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t mt-4">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-9 h-9"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ViewMasterKategoriAset
        kategori={viewDialog.kategori}
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, kategori: null })}
      />

      <EditMasterKategoriAset
        kategori={editDialog.kategori}
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, kategori: null })}
        onSuccess={fetchKategori}
      />

      <HapusMasterKategoriAset
        kategori={deleteDialog.kategori}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, kategori: null })}
        onSuccess={fetchKategori}
      />
    </div>
  );
};

export default MasterKategoriAset;