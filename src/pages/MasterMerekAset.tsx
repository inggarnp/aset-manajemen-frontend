import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import TambahMasterMerekAset from '@/components/pages/master_merek_aset/TambahMasterMerekAset';
import EditMasterMerekAset from '@/components/pages/master_merek_aset/EditMasterMerekAset';
import ViewMasterMerekAset from '@/components/pages/master_merek_aset/ViewMasterMerekAset';
import HapusMasterMerekAset from '@/components/pages/master_merek_aset/HapusMasterMerekAset';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface MasterMerekAset {
  id_merek: string;
  nama_merek: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
}

const MasterMerekAset: React.FC = () => {
  const [merekList, setMerekList] = useState<MasterMerekAset[]>([]);
  const [filteredData, setFilteredData] = useState<MasterMerekAset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    merek: MasterMerekAset | null;
  }>({
    open: false,
    merek: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    merek: MasterMerekAset | null;
  }>({
    open: false,
    merek: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    merek: MasterMerekAset | null;
  }>({
    open: false,
    merek: null,
  });

  const fetchMerek = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/master-merek-aset');
      const data = Array.isArray(response.data) ? response.data : [];
      setMerekList(data);
      setFilteredData(data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch master merek';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setMerekList([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = merekList.filter((m) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        m.nama_merek.toLowerCase().includes(searchLower) ||
        m.keterangan.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, merekList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (merek: MasterMerekAset) => {
    setViewDialog({ open: true, merek });
  };

  const handleEdit = (merek: MasterMerekAset) => {
    setEditDialog({ open: true, merek });
  };

  const handleDeleteClick = (merek: MasterMerekAset) => {
    setDeleteDialog({ open: true, merek });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchMerek();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Master Merek Aset</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Kelola merek aset yang tersedia</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Daftar Merek</CardTitle>
              <CardDescription className="text-sm">Semua merek aset yang terdaftar</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search merek..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahMasterMerekAset onSuccess={fetchMerek} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">Loading...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No merek found' : 'Belum ada merek'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Nama Merek</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">Keterangan</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((merek) => (
                      <TableRow key={merek.id_merek}>
                        <TableCell className="font-medium text-sm">{merek.nama_merek}</TableCell>
                        <TableCell className="text-sm hidden md:table-cell">
                          {merek.keterangan || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(merek)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(merek)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(merek)}
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

      <ViewMasterMerekAset
        merek={viewDialog.merek}
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, merek: null })}
      />

      <EditMasterMerekAset
        merek={editDialog.merek}
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, merek: null })}
        onSuccess={fetchMerek}
      />

      <HapusMasterMerekAset
        merek={deleteDialog.merek}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, merek: null })}
        onSuccess={fetchMerek}
      />
    </div>
  );
};

export default MasterMerekAset;