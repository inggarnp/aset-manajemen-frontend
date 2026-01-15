import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import TambahMasterTipeAset from '@/components/pages/master_tipe_aset/TambahMasterTipeAset';
import EditMasterTipeAset from '@/components/pages/master_tipe_aset/EditMasterTipeAset';
import ViewMasterTipeAset from '@/components/pages/master_tipe_aset/ViewMasterTipeAset';
import HapusMasterTipeAset from '@/components/pages/master_tipe_aset/HapusMasterTipeAset';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface MasterTipeAset {
  id_tipe: string;
  nama_tipe: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
}

const MasterTipeAset: React.FC = () => {
  const [tipeList, setTipeList] = useState<MasterTipeAset[]>([]);
  const [filteredData, setFilteredData] = useState<MasterTipeAset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    tipe: MasterTipeAset | null;
  }>({
    open: false,
    tipe: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    tipe: MasterTipeAset | null;
  }>({
    open: false,
    tipe: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    tipe: MasterTipeAset | null;
  }>({
    open: false,
    tipe: null,
  });

  const fetchTipe = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/master-tipe-aset');
      const data = Array.isArray(response.data) ? response.data : [];
      setTipeList(data);
      setFilteredData(data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch master tipe';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setTipeList([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = tipeList.filter((t) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        t.nama_tipe.toLowerCase().includes(searchLower) ||
        t.keterangan.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, tipeList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (tipe: MasterTipeAset) => {
    setViewDialog({ open: true, tipe });
  };

  const handleEdit = (tipe: MasterTipeAset) => {
    setEditDialog({ open: true, tipe });
  };

  const handleDeleteClick = (tipe: MasterTipeAset) => {
    setDeleteDialog({ open: true, tipe });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchTipe();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Master Tipe Aset</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Kelola tipe aset yang tersedia</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Daftar Tipe</CardTitle>
              <CardDescription className="text-sm">Semua tipe aset yang terdaftar</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tipe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahMasterTipeAset onSuccess={fetchTipe} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No tipe found' : 'Belum ada tipe'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Nama Tipe</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">Keterangan</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((tipe) => (
                      <TableRow key={tipe.id_tipe}>
                        <TableCell className="font-medium text-sm">{tipe.nama_tipe}</TableCell>
                        <TableCell className="text-sm hidden md:table-cell">
                          {tipe.keterangan || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(tipe)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(tipe)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(tipe)}
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

      <ViewMasterTipeAset
        tipe={viewDialog.tipe}
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, tipe: null })}
      />

      <EditMasterTipeAset
        tipe={editDialog.tipe}
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, tipe: null })}
        onSuccess={fetchTipe}
      />

      <HapusMasterTipeAset
        tipe={deleteDialog.tipe}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, tipe: null })}
        onSuccess={fetchTipe}
      />
    </div>
  );
};

export default MasterTipeAset;