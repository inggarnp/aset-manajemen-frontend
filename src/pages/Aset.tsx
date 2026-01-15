import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import TambahAset from '@/components/pages/aset/TambahAset';
import EditAset from '@/components/pages/aset/EditAset';
import ViewAset from '@/components/pages/aset/ViewAset';
import HapusAset from '@/components/pages/aset/HapusAset';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Aset {
  id_aset: string;
  kode_aset: string;
  nama_aset: string;
  serial_number: string;
  tanggal_pembelian: string;
  harga_beli: number;
  id_master_aset: string;
  status_aset: string;
  created_at: string;
  updated_at: string;
}

const Aset: React.FC = () => {
  const [asetList, setAsetList] = useState<Aset[]>([]);
  const [filteredData, setFilteredData] = useState<Aset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [viewAset, setViewAset] = useState<Aset | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editAset, setEditAset] = useState<Aset | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteAset, setDeleteAset] = useState<Aset | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchAset = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/aset');
      const data = Array.isArray(response.data) ? response.data : [];
      setAsetList(data);
      setFilteredData(data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch aset';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setAsetList([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    const filtered = asetList.filter((aset) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        aset.kode_aset.toLowerCase().includes(searchLower) ||
        aset.nama_aset.toLowerCase().includes(searchLower) ||
        aset.serial_number.toLowerCase().includes(searchLower) ||
        aset.status_aset.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, asetList]);

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (aset: Aset) => {
    setViewAset(aset);
    setIsViewOpen(true);
  };

  const handleEdit = (aset: Aset) => {
    setEditAset(aset);
    setIsEditOpen(true);
  };

  const handleDelete = (aset: Aset) => {
    setDeleteAset(aset);
    setIsDeleteOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchAset();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'tersedia': { label: 'Tersedia', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      'digunakan': { label: 'Digunakan', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      'rusak': { label: 'Rusak', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      'maintenance': { label: 'Maintenance', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
    };

    const config = statusMap[status.toLowerCase()] || { label: status, className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header - Responsive */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Aset</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage company assets</p>
      </div>

      <Card>
        <CardHeader>
          {/* Responsive Header - Stack on mobile */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Aset List</CardTitle>
              <CardDescription className="text-sm">All assets registered in the system</CardDescription>
            </div>
            
            {/* Search & Add Button - Responsive */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search - Full width on mobile, fixed on desktop */}
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search aset..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahAset onSuccess={fetchAset} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">Loading aset...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No aset found matching your search' : 'No aset found'}
            </div>
          ) : (
            <>
              {/* Table with horizontal scroll on mobile */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Kode Aset</TableHead>
                          <TableHead className="whitespace-nowrap">Nama Aset</TableHead>
                          <TableHead className="whitespace-nowrap hidden md:table-cell">Serial Number</TableHead>
                          <TableHead className="whitespace-nowrap hidden lg:table-cell">Tanggal Beli</TableHead>
                          <TableHead className="whitespace-nowrap">Harga Beli</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((aset) => (
                          <TableRow key={aset.id_aset}>
                            <TableCell className="font-medium whitespace-nowrap text-sm">{aset.kode_aset}</TableCell>
                            <TableCell className="min-w-[150px] sm:min-w-0">
                              <div className="text-sm font-medium">{aset.nama_aset}</div>
                              {/* Show serial on mobile as secondary info */}
                              <div className="text-xs text-muted-foreground md:hidden font-mono">{aset.serial_number}</div>
                            </TableCell>
                            <TableCell className="font-mono text-sm hidden md:table-cell">{aset.serial_number}</TableCell>
                            <TableCell className="text-muted-foreground text-sm hidden lg:table-cell whitespace-nowrap">
                              {formatDate(aset.tanggal_pembelian)}
                            </TableCell>
                            <TableCell className="font-medium text-sm whitespace-nowrap">{formatCurrency(aset.harga_beli)}</TableCell>
                            <TableCell>{getStatusBadge(aset.status_aset)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleView(aset)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(aset)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(aset)}
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

              {/* Responsive Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t mt-4">
                {/* Showing info - hide on very small screens or make smaller */}
                <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                  <span className="hidden sm:inline">Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries</span>
                  <span className="sm:hidden">{startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}</span>
                </div>
                
                {/* Pagination controls */}
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
                  
                  {/* Page numbers - show fewer on mobile */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // On mobile, show only current, first, and last
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

      <EditAset
        aset={editAset}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={fetchAset}
      />

      <ViewAset
        aset={viewAset}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      <HapusAset
        aset={deleteAset}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={fetchAset}
      />
    </div>
  );
};

export default Aset;