import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import TambahJabatan from '@/components/pages/jabatan/TambahJabatan';
import EditJabatan from '@/components/pages/jabatan/EditJabatan';
import ViewJabatan from '@/components/pages/jabatan/ViewJabatan';
import HapusJabatan from '@/components/pages/jabatan/HapusJabatan';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Jabatan {
  id_jabatan: string;
  kode_jabatan: string;
  nama_jabatan: string;
}

const Jabatan: React.FC = () => {
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [filteredData, setFilteredData] = useState<Jabatan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [viewJabatan, setViewJabatan] = useState<Jabatan | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editJabatan, setEditJabatan] = useState<Jabatan | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteJabatan, setDeleteJabatan] = useState<Jabatan | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchJabatan = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/jabatan');
      const data = Array.isArray(response.data) ? response.data : [];
      setJabatanList(data);
      setFilteredData(data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch jabatan';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setJabatanList([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = jabatanList.filter((jab) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        jab.kode_jabatan.toLowerCase().includes(searchLower) ||
        jab.nama_jabatan.toLowerCase().includes(searchLower) ||
        jab.id_jabatan.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, jabatanList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (jabatan: Jabatan) => {
    setViewJabatan(jabatan);
    setIsViewOpen(true);
  };

  const handleEdit = (jabatan: Jabatan) => {
    setEditJabatan(jabatan);
    setIsEditOpen(true);
  };

  const handleDelete = (jabatan: Jabatan) => {
    setDeleteJabatan(jabatan);
    setIsDeleteOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchJabatan();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Jabatan</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage positions/roles</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Jabatan List</CardTitle>
              <CardDescription className="text-sm">All positions registered in the system</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jabatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahJabatan onSuccess={fetchJabatan} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">Loading jabatan...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No jabatan found matching your search' : 'No jabatan found'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Kode Jabatan</TableHead>
                          <TableHead className="whitespace-nowrap">Nama Jabatan</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((jabatan) => (
                          <TableRow key={jabatan.id_jabatan}>
                            <TableCell className="font-medium text-sm">{jabatan.kode_jabatan}</TableCell>
                            <TableCell className="text-sm">{jabatan.nama_jabatan}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleView(jabatan)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(jabatan)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(jabatan)}
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

      <EditJabatan
        jabatan={editJabatan}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={fetchJabatan}
      />

      <ViewJabatan
        jabatan={viewJabatan}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      <HapusJabatan
        jabatan={deleteJabatan}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={fetchJabatan}
      />
    </div>
  );
};

export default Jabatan;