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
import { toast } from "@/hooks/use-toast";
import TambahDepartemen from "@/components/pages/departemen/TambahDepartemen";
import EditDepartemen from "@/components/pages/departemen/EditDepartemen";
import ViewDepartemen from "@/components/pages/departemen/ViewDepartemen";
import HapusDepartemen from "@/components/pages/departemen/HapusDepartemen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Departemen {
  id_departemen: string;
  kode_departemen: string;
  nama_departemen: string;
}

const Departemen: React.FC = () => {
  const [departemenList, setDepartemenList] = useState<Departemen[]>([]);
  const [filteredData, setFilteredData] = useState<Departemen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [viewDepartemen, setViewDepartemen] = useState<Departemen | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editDepartemen, setEditDepartemen] = useState<Departemen | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteDepartemen, setDeleteDepartemen] = useState<Departemen | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchDepartemen = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/departemen");
      const data = Array.isArray(response.data) ? response.data : [];
      setDepartemenList(data);
      setFilteredData(data);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to fetch departemen";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setDepartemenList([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = departemenList.filter((dept) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        dept.kode_departemen.toLowerCase().includes(searchLower) ||
        dept.nama_departemen.toLowerCase().includes(searchLower) ||
        dept.id_departemen.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, departemenList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (departemen: Departemen) => {
    setViewDepartemen(departemen);
    setIsViewOpen(true);
  };

  const handleEdit = (departemen: Departemen) => {
    setEditDepartemen(departemen);
    setIsEditOpen(true);
  };

  const handleDelete = (departemen: Departemen) => {
    setDeleteDepartemen(departemen);
    setIsDeleteOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchDepartemen();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Departemen</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage departments</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Departemen List</CardTitle>
              <CardDescription className="text-sm">
                All departments registered in the system
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search departemen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahDepartemen onSuccess={fetchDepartemen} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              Loading departemen...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery
                ? "No departemen found matching your search"
                : "No departemen found"}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Kode Departemen</TableHead>
                          <TableHead className="whitespace-nowrap">Nama Departemen</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((departemen) => (
                          <TableRow key={departemen.id_departemen}>
                            <TableCell className="font-medium text-sm">
                              {departemen.kode_departemen}
                            </TableCell>
                            <TableCell className="text-sm">{departemen.nama_departemen}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleView(departemen)}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(departemen)}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(departemen)}
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

      <EditDepartemen
        departemen={editDepartemen}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={fetchDepartemen}
      />

      <ViewDepartemen
        departemen={viewDepartemen}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      <HapusDepartemen
        departemen={deleteDepartemen}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={fetchDepartemen}
      />
    </div>
  );
};

export default Departemen;