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
import TambahRoles from "@/components/pages/roles/TambahRoles";
import EditRoles from "@/components/pages/roles/EditRoles";
import HapusRoles from "@/components/pages/roles/HapusRoles";
import ViewRoles from "@/components/pages/roles/VIewRoles";
import AturPermissions from "@/components/pages/roles/AturPermissions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, Trash2, Settings, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Role {
  id_role: string;
  kode_role: string;
  nama_role: string;
  created_at: string;
  updated_at: string;
}

const Role: React.FC = () => {
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [filteredData, setFilteredData] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [viewRole, setViewRole] = useState<Role | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [permissionRole, setPermissionRole] = useState<Role | null>(null);
  const [isPermissionOpen, setIsPermissionOpen] = useState(false);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/roles");
      const data = Array.isArray(response.data) ? response.data : [];
      setRoleList(data);
      setFilteredData(data);
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to fetch roles";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      setRoleList([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = roleList.filter((role) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        role.kode_role.toLowerCase().includes(searchLower) ||
        role.nama_role.toLowerCase().includes(searchLower) ||
        role.id_role.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, roleList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (role: Role) => {
    setViewRole(role);
    setIsViewOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditRole(role);
    setIsEditOpen(true);
  };

  const handleDelete = (role: Role) => {
    setDeleteRole(role);
    setIsDeleteOpen(true);
  };

  const handlePermission = (role: Role) => {
    setPermissionRole(role);
    setIsPermissionOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Role Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Manage user roles and permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Role List</CardTitle>
              <CardDescription className="text-sm">
                All roles registered in the system
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahRoles onSuccess={fetchRoles} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              Loading roles...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No roles found matching your search' : 'No roles found'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Kode Role</TableHead>
                          <TableHead className="whitespace-nowrap">Nama Role</TableHead>
                          <TableHead className="whitespace-nowrap hidden md:table-cell">Created At</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((role) => (
                          <TableRow key={role.id_role}>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">{role.kode_role}</Badge>
                            </TableCell>
                            <TableCell className="font-medium text-sm min-w-[150px] sm:min-w-0">
                              <div>{role.nama_role}</div>
                              <div className="text-xs text-muted-foreground md:hidden">
                                {formatDate(role.created_at)}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                              {formatDate(role.created_at)}
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
                                    onClick={() => handlePermission(role)}
                                  >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Atur Permission
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleView(role)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(role)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(role)}
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

      <EditRoles
        role={editRole}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={fetchRoles}
      />

      <ViewRoles
        role={viewRole}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      <HapusRoles
        role={deleteRole}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={fetchRoles}
      />

      <AturPermissions
        role={permissionRole}
        open={isPermissionOpen}
        onOpenChange={setIsPermissionOpen}
        onSuccess={fetchRoles}
      />
    </div>
  );
};

export default Role;