import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/User";
import Jabatan from "@/pages/Jabatan";
import Departement from "@/pages/Departemen";
import User from "@/pages/User";
import Roles from "@/pages/Roles";
import MasterKategori from "@/pages/MasterKategoriAset";
import MasterMerek from "@/pages/MasterMerekAset";
import MasterTipe from "@/pages/MasterTipeAset";
import MasterAset from "@/pages/MasterAset";
import Aset from "@/pages/Aset";
import RiwayatPemakaian from "@/pages/RiwayatPemakaian";
import KeuanganPenyusutan from "@/pages/KeuanganPenyusutan";
import PenyusutanAset from "@/pages/PenyusutanAset";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredPermission="user.read">
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jabatan"
                element={
                  <ProtectedRoute requiredPermission="jabatan.view">
                    <Jabatan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/departemen"
                element={
                  <ProtectedRoute requiredPermission="departemen.view">
                    <Departement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user"
                element={
                  <ProtectedRoute requiredPermission="user.view">
                    <User />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roles"
                element={
                  <ProtectedRoute requiredPermission="role.view">
                    <Roles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/master-aset"
                element={
                  <ProtectedRoute requiredPermission="master_aset.view">
                    <MasterAset />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/kategori"
                element={
                  <ProtectedRoute requiredPermission="kategori.view">
                    <MasterKategori />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/merek"
                element={
                  <ProtectedRoute requiredPermission="merk.view">
                    <MasterMerek />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tipe"
                element={
                  <ProtectedRoute requiredPermission="tipe.view">
                    <MasterTipe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/aset"
                element={
                  <ProtectedRoute requiredPermission="aset.view">
                    <Aset />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/riwayat-pemakaian"
                element={
                  <ProtectedRoute requiredPermission="riwayat.view">
                    <RiwayatPemakaian />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/keuangan-penyusutan"
                element={
                  <ProtectedRoute requiredPermission="keuangan.view">
                    <KeuanganPenyusutan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/penyusutan-aset"
                element={
                  <ProtectedRoute requiredPermission="penyusutan.view">
                    <PenyusutanAset />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;