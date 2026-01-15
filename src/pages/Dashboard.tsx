import React, { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  Package,
  DollarSign,
  FileText,
  TrendingDown,
  History,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  total_assets: number;
  total_users?: number;
  total_riwayat?: number;
  total_master_aset?: number;
  total_depreciation?: number;
}

const Dashboard: React.FC = () => {
  const { user, isLoading: authLoading, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardStats();
    }
  }, [user?.id_user, authLoading]);

  const fetchDashboardStats = async () => {
    setIsLoadingData(true);
    setError(null);

    try {
      const response = await api.get("/api/dashboard/stats");
      
      if (response.data?.success) {
        setStats(response.data.data);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (err: any) {
      console.error("Failed to fetch dashboard stats:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const quickActions = [
    {
      label: "Manage Assets",
      permission: "aset.view",
      path: "/aset",
      icon: Package,
      color: "bg-blue-500",
      description: "View and manage assets",
    },
    {
      label: "Manage Users",
      permission: "user.view",
      path: "/user",
      icon: Users,
      color: "bg-green-500",
      description: "View and manage users",
    },
    {
      label: "Asset History",
      permission: "riwayat.view",
      path: "/riwayat-pemakaian",
      icon: History,
      color: "bg-purple-500",
      description: "View usage history",
    },
    {
      label: "Depreciation Report",
      permission: "penyusutan.view",
      path: "/penyusutan-aset",
      icon: TrendingDown,
      color: "bg-orange-500",
      description: "View depreciation",
    },
  ];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.nama_user}!
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardStats}
              className="mt-3"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoadingData ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Assets - Semua role bisa lihat */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Assets
                </CardTitle>
                <Package className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.total_assets || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Assets under management
                </p>
              </CardContent>
            </Card>

            {/* Total Users - Hanya tampil jika punya permission */}
            {stats?.total_users !== undefined && (
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.total_users}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Registered users in system
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Total Master Aset */}
            {stats?.total_master_aset !== undefined && (
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Master Assets
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.total_master_aset}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Asset templates
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Total Riwayat */}
            {stats?.total_riwayat !== undefined && (
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Usage History
                  </CardTitle>
                  <History className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.total_riwayat}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total usage records
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Total Depreciation */}
            {stats?.total_depreciation !== undefined && (
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Depreciation
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(stats.total_depreciation)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Accumulated depreciation
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts based on your permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {quickActions
                  .filter((action) => hasPermission(action.permission))
                  .map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={() => navigate(action.path)}
                        className="flex flex-col items-start p-4 rounded-lg border hover:bg-accent hover:shadow-md transition-all text-left group"
                      >
                        <div
                          className={`${action.color} p-2 rounded-md mb-3 group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="font-medium text-sm mb-1">
                          {action.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
              </div>

              {quickActions.filter((a) => hasPermission(a.permission))
                .length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No quick actions available based on your permissions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;