import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Users,
  Shield,
  Package,
  FolderOpen,
  History,
  Wallet,
  FileText,
  ChevronDown,
  ChevronRight,
  UserCog,
  Box,
  TrendingDown,
  X,
} from "lucide-react";

interface MenuItem {
  name: string;
  path?: string;
  icon: any;
  children?: MenuItem[];
  requiredPermission?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Management",
      icon: UserCog,
      children: [
        {
          name: "Departemen",
          path: "/departemen",
          icon: Building2,
          requiredPermission: "departemen.view",
        },
        {
          name: "Jabatan",
          path: "/jabatan",
          icon: Briefcase,
          requiredPermission: "jabatan.view",
        },
        {
          name: "Roles",
          path: "/roles",
          icon: Shield,
          requiredPermission: "role.view",
        },
        {
          name: "Users",
          path: "/user",
          icon: Users,
          requiredPermission: "user.view",
        },
      ],
    },
    {
      name: "Assets",
      icon: Box,
      children: [
        {
          name: "Master Kategori",
          path: "/kategori",
          icon: Package,
          requiredPermission: "kategori.view",
        },
        {
          name: "Master Merek",
          path: "/merek",
          icon: Package,
          requiredPermission: "merk.view",
        },
        {
          name: "Master Tipe",
          path: "/tipe",
          icon: Package,
          requiredPermission: "tipe.view",
        },
        {
          name: "Master Aset",
          path: "/master-aset",
          icon: Package,
          requiredPermission: "master_aset.view",
        },
        {
          name: "Aset",
          path: "/aset",
          icon: FolderOpen,
          requiredPermission: "aset.view",
        },
        {
          name: "Riwayat Pemakaian",
          path: "/riwayat-pemakaian",
          icon: History,
          requiredPermission: "riwayat.view",
        },
      ],
    },
    {
      name: "Depreciation",
      icon: TrendingDown,
      children: [
        {
          name: "Keuangan Penyusutan",
          path: "/keuangan-penyusutan",
          icon: Wallet,
          requiredPermission: "keuangan.view",
        },
        {
          name: "Penyusutan Aset",
          path: "/penyusutan-aset",
          icon: FileText,
          requiredPermission: "penyusutan.view",
        },
      ],
    },
  ];

  const filterMenuByPermission = (items: MenuItem[]): MenuItem[] => {
    return items
      .map((item) => {
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterMenuByPermission(item.children);
          
          if (filteredChildren.length === 0) {
            return null;
          }

          return {
            ...item,
            children: filteredChildren,
          };
        }

        if (!item.requiredPermission) {
          return item;
        }

        if (hasPermission(item.requiredPermission)) {
          return item;
        }

        return null;
      })
      .filter((item): item is MenuItem => item !== null);
  };

  const filteredMenuItems = filterMenuByPermission(menuItems);

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isGroupActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some(
      (child) => child.path && location.pathname === child.path
    );
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when clicking a link
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus.includes(item.name);
    const active = item.path
      ? isActive(item.path)
      : isGroupActive(item.children);

    if (hasChildren) {
      return (
        <div key={item.name} className="space-y-1">
          {/* Parent Menu Item */}
          <button
            onClick={() => toggleMenu(item.name)}
            className={`
              group w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200
              ${
                active
                  ? "bg-slate-800/70 text-white"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
                  ${
                    active
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-slate-700/30 group-hover:bg-slate-700/50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">{item.name}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 transition-transform duration-300" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform duration-300" />
            )}
          </button>

          {/* Children Menu Items */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div className="ml-4 space-y-1 border-l-2 border-slate-700/50 pl-2 mt-1">
              {item.children!.map((child) => {
                const ChildIcon = child.icon;
                const childActive = isActive(child.path);

                return (
                  <Link
                    key={child.path}
                    to={child.path!}
                    onClick={handleLinkClick}
                    className={`
                      group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                      ${
                        childActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
                          : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                      }
                    `}
                  >
                    <div
                      className={`
                        w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200
                        ${
                          childActive
                            ? "bg-white/10"
                            : "bg-slate-700/20 group-hover:bg-slate-700/40"
                        }
                      `}
                    >
                      <ChildIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-sm">{child.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Single Menu Item (no children)
    return (
      <Link
        key={item.path}
        to={item.path!}
        onClick={handleLinkClick}
        className={`
          group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
          ${
            active
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
          }
        `}
      >
        <div
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
            ${
              active
                ? "bg-white/10"
                : "bg-slate-700/30 group-hover:bg-slate-700/50"
            }
          `}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-medium text-sm">{item.name}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
          border-r border-slate-700/50 flex flex-col fixed left-0 top-0 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Asset Management</h1>
                <p className="text-slate-400 text-xs">
                  {user?.nama_user || "User"}
                </p>
              </div>
            </div>
            {/* Close button - only visible on mobile */}
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {filteredMenuItems.map((item) => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
            <p className="text-slate-400 text-xs">© 2025 Asset Management</p>
            <p className="text-slate-500 text-xs mt-0.5">All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;