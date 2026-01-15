import React, { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import TambahUser from '@/components/pages/user/TambahUser';
import EditUser from '@/components/pages/user/EditUser';
import ViewUser from '@/components/pages/user/ViewUser';
import HapusUser from '@/components/pages/user/HapusUser';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface User {
  id_user: string;
  nama_user: string;
  email: string;
  phone_number: string;
  nik: string;
  foto_user?: string | null;
  id_jabatan: string;
  id_departemen: string;
  id_role: string;
  created_at: string;
  updated_at: string;
}

const User: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/users');
      const data = Array.isArray(response.data) ? response.data : [];
      setUserList(data);
      setFilteredData(data);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to fetch users';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
      setUserList([]);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = userList.filter((user) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.nama_user.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone_number.toLowerCase().includes(searchLower) ||
        user.nik.toLowerCase().includes(searchLower)
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, userList]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleView = (user: User) => {
    setViewDialog({
      open: true,
      user,
    });
  };

  const handleEdit = (user: User) => {
    setEditDialog({
      open: true,
      user,
    });
  };

  const handleDeleteClick = (user: User) => {
    setDeleteDialog({
      open: true,
      user,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage system users and their access</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">User List</CardTitle>
              <CardDescription className="text-sm">All users registered in the system</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-[250px] lg:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <TambahUser onSuccess={fetchUsers} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">Loading users...</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
              {searchQuery ? 'No users found matching your search' : 'No users found'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">Foto</TableHead>
                          <TableHead className="whitespace-nowrap">Nama</TableHead>
                          <TableHead className="whitespace-nowrap hidden md:table-cell">Email</TableHead>
                          <TableHead className="whitespace-nowrap hidden lg:table-cell">Phone</TableHead>
                          <TableHead className="whitespace-nowrap hidden xl:table-cell">NIK</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((user) => (
                          <TableRow key={user.id_user}>
                            <TableCell>
                              {user.foto_user ? (
                                <img
                                  src={`http://localhost:8080/${user.foto_user}`}
                                  alt={user.nama_user}
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-muted"
                                />
                              ) : (
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-xs sm:text-sm">
                                  {user.nama_user.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="min-w-[150px] sm:min-w-0">
                              <div className="font-medium text-sm">{user.nama_user}</div>
                              <div className="text-xs text-muted-foreground md:hidden">{user.email}</div>
                              <div className="text-xs text-muted-foreground lg:hidden xl:hidden">{user.phone_number}</div>
                            </TableCell>
                            <TableCell className="text-sm hidden md:table-cell">{user.email}</TableCell>
                            <TableCell className="text-sm hidden lg:table-cell">{user.phone_number}</TableCell>
                            <TableCell className="text-sm hidden xl:table-cell">{user.nik}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleView(user)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(user)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(user)}
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

      <ViewUser
        user={viewDialog.user}
        open={viewDialog.open}
        onOpenChange={(open) => setViewDialog({ open, user: null })}
      />

      <EditUser
        user={editDialog.user}
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ open, user: null })}
        onSuccess={fetchUsers}
      />

      <HapusUser
        user={deleteDialog.user}
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, user: null })}
        onSuccess={fetchUsers}
      />
    </div>
  );
};

export default User;